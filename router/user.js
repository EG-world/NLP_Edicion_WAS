import express from "express";
import * as userController from "../controller/user.js";

const router = express.Router();

// 유저 _id로 정보 불러오기
router.get("/:userId", userController.getMyInfo);


export default router;