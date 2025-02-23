import express from "express";
import * as userController from "../controller/user.js";

const router = express.Router();

// ✅ 유저 이력서 불러오기
router.get("/:userId", userController.getMyInfo);

// ✅ 유저 이력서 업데이트
router.put("/resume", userController.updateMyResume);

export default router;
