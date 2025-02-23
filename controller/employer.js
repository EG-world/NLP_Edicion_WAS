import * as employerData from "../data/employer.js";

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

    res.status(200).json(applicants);
  } catch (error) {
    console.error("지원자 목록 조회 실패:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}