import express from "express";
import * as jobController from "../controller/job.js";

const router = express.Router();

// 유저 정보(lorem, preferred) 조회
router.get("/info/:userId", jobController.getUerInfo);

// 유저 skills와 일치하는 채용 공고 목록 조회
router.get("/:userId", jobController.getJobsByUserSkills);

// 선택한 채용 공고에 이력서 넣기
router.post("/apply", jobController.applyForJobs)

// 특정 카테고리별 채용 공고 조회
router.get("/category/:categoryCode", jobController.getCategoryJobs);

export default router;