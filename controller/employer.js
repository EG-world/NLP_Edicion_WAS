import * as employerData from "../data/employer.js";
import { sendTokenToSMS } from "../utils/sms.js";
import { config } from "../config.js";

// 기업주 채용 공고 및 지원자 리스트 조회
export async function getEmployerJobsAndApplicants(req, res) {
  const { businessNumber } = req.params;

  try {
    const jobs = await employerData.getJobsByBusinessNumber(businessNumber);
    if (!jobs.length) {
      return res.status(404).json({ message: "등록된 채용 공고가 없습니다." });
    }

    res.status(200).json(jobs);
  } catch (error) {
    console.error("채용 공고 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}

// 해당 공고에 지원한 지원자 리스트 조회
export async function getApplicantsByEmployer(req, res) {
  const { businessNumber } = req.params;
  
  try {
    const applicants = await employerData.getApplicantsByBusinessNumber(businessNumber);
      
    if (!applicants.length) {
      return res.status(404).json({ message: "해당 사업자의 채용 공고에 지원한 지원자가 없습니다." });
    }

    res.status(200).json({ success: true, data: applicants });
  } catch (error) {
    console.error("지원자 목록 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}

export const getTalentedUsers = async (req, res) => {
  try {
    const { talentedType } = req.params;
    const typeNum = parseInt(talentedType, 10);

    const validTalentedTypes = config.talented.type.map((_, index) => index);

    // 디버깅용
    // console.log("Received talentedType:", talentedType);
    // console.log("Parsed talentedType:", typeNum);
    // console.log("Valid talented types:", validTalentedTypes);
    
    // talentedType이 0~3 사이의 값인지 확인
    if (!validTalentedTypes.includes(typeNum)) {
      return res.status(400).json({ message: "유효하지 않은 talentedType 코드입니다." });
    }

    const users = await employerData.findUsersByTalentedType(typeNum);

    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error("추천 인재 조회 중 오류 발생:", error);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
};

// 기업 정보 조회
export const getJobInfo = async (req, res) => {
  const { businessNumber } = req.params;
  const { phoneNumber } = req.body;

  try {
    const jobInfo = await employerData.findEmployerByBisnessNumber(businessNumber);

    // [디버깅] jobInfo: 배열
    // console.log(jobInfo);
    await sendTokenToSMS(phoneNumber, jobInfo[0])

    if (!jobInfo.length) {
      return res.status(404).json({ message: "해당 기업 정보가 없습니다." });
    }
    res.status(200).json({ success: true, data: jobInfo });
  } catch (error) {
    console.error("기업 정보 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
};