import * as userData from '../data/user.js';
import { config } from '../config.js';

// 내 정보 조회
export async function getMyInfo(req, res) {
  const { userId } = req.params;
  try {
    const user = await userData.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: '해당 유저를 찾을 수 없습니다.' });
    }
    // 비밀번호 제외
    const { password, ...userInfo } = user.toObject();
    res.status(200).json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러' });
  }
}

// ✅ 이력서 저장 (POST)
export async function saveResume(req, res) {
  const { lorem, resume, jobObjective } = req.body;
  const userId = req.headers["userid"]; // ✅ 헤더에서 userId 가져오기

  if (!userId) {
    return res.status(400).json({ message: "userId가 필요합니다." });
  }

  try {
    const user = await userData.findOne({ userId });
    if (!user) {
      return res.status(404).json({ message: "해당 유저를 찾을 수 없습니다." });
    }

    // ✅ 유저 정보 업데이트
    user.lorem = lorem;
    user.resume = resume;
    user.jobObjective = jobObjective;
    user.updatedAt = new Date();

    await user.save();

    res.status(200).json({ message: "자기소개서가 성공적으로 저장되었습니다.", user });
  } catch (error) {
    console.error("자기소개서 저장 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}

export async function updateMyResume(req, res) {
  const { lorem, resume, education, history, license, talentedType } = req.body;
  const userId = req.headers["userid"] || req.body.userId;

  console.log("🔍 [DEBUG] 요청 받은 데이터:", { userId, resume, education, history, license, talentedType });

  if (!userId) {
    return res.status(400).json({ message: "userId가 필요합니다." });
  }

  try {
    const user = await userData.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "해당 유저를 찾을 수 없습니다." });
    }

    // ✅ talentedType을 문자열에서 숫자로 변환 (0~3)
    const talentedTypeMapping = config.talented.type.reduce((acc, type, index) => {
      acc[type] = index;
      return acc;
    }, {});

    console.log("📌 [DEBUG] talentedType 매핑 테이블:", talentedTypeMapping);

    const talentedTypeNumber = talentedTypeMapping[talentedType];

    if (talentedType !== undefined && talentedTypeNumber === undefined) {
      console.error(`❌ [ERROR] 유효하지 않은 talentedType 값: ${talentedType}`);
      return res.status(400).json({ message: `유효하지 않은 talentedType: ${talentedType}` });
    }

    // ✅ 유저 정보 업데이트 (jobObjective는 요청이 없을 경우 기존 값 유지)
    user.lorem = lorem ?? user.lorem;
    user.resume = resume ?? user.resume;
    user.education = education ?? user.education;
    user.history = history ?? user.history;
    user.license = license ?? user.license;
    user.talentedType = talentedType !== undefined ? talentedTypeNumber : user.talentedType;
    user.updatedAt = new Date();

    // 🔹 jobObjective가 요청에 포함되지 않으면 기존 값 유지
    if (req.body.jobObjective !== undefined) {
      user.jobObjective = req.body.jobObjective;
    }

    // ✅ 변경 감지 설정
    user.markModified("resume");
    user.markModified("lorem");
    user.markModified("education");
    user.markModified("history");
    user.markModified("license");
    user.markModified("talentedType");
    user.markModified("jobObjective");

    await user.save();

    console.log("✅ [DEBUG] 저장 완료된 유저 데이터:", user);

    res.status(200).json({ message: "이력서가 성공적으로 저장되었습니다.", user });
  } catch (error) {
    console.error("❌ 이력서 저장 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}
