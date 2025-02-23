import express from "express";
import * as userController from "../controller/api.js";

const router = express.Router();

// ✅ 자기소개서 저장 API (로그인된 유저의 userId 활용)
router.post("/saveResume", userController.saveResume);

export default router;
