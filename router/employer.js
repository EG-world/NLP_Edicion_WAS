import express from "express";
import * as employerController from "../controller/employer.js";

const router = express.Router();

// 기업주 채용 공고 및 지원자 리스트 조회(예외 처리 대비 라우터)
router.get("/:businessNumber", employerController.getEmployerJobsAndApplicants);

// 특정 채용 공고에 지원한 지원자 목록 조회
router.get("/:businessNumber/applicants", employerController.getApplicantsByEmployer);

// 인재상 유저 조회
router.get("/talent/:talentedType", employerController.getTalentedUsers);

// sms 서비스
router.post("/sms/:businessNumber", employerController.getJobInfo);

export default router;