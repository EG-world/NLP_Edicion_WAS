import * as userData from '../data/user.js';

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

// ✅ 자기소개서 업데이트 (PUT)
export async function updateMyResume(req, res) {
  const { lorem, resume, jobObjective, education, history, license } = req.body;
  const userId = req.headers["userid"] || req.body.userId; 

  console.log("🔍 [DEBUG] 요청 받은 데이터:", { userId, resume, jobObjective, education, history, license });

  if (!userId) {
    return res.status(400).json({ message: "userId가 필요합니다." });
  }

  try {
    const user = await userData.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "해당 유저를 찾을 수 없습니다." });
    }

    // ✅ 유저 정보 업데이트
    user.lorem = lorem || user.lorem;
    user.resume = resume || user.resume;
    user.jobObjective = jobObjective || user.jobObjective;
    user.education = education || user.education;
    user.history = history || user.history;
    user.license = license || user.license;
    user.updatedAt = new Date();

    // ✅ 강제로 변경 감지 (MongoDB에서 변경 사항 인식)
    user.markModified("resume");
    user.markModified("lorem");
    user.markModified("jobObjective");
    user.markModified("education");
    user.markModified("history");
    user.markModified("license");

    await user.save();

    console.log("✅ [DEBUG] 저장 완료된 유저 데이터:", user);

    res.status(200).json({ message: "이력서가 성공적으로 저장되었습니다.", user });
  } catch (error) {
    console.error("❌ 이력서 저장 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}
