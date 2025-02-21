import express from "express";
import * as authController from "../controller/auth.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// 사용자 회원가입
router.post("/signup/user", authController.signupuser);

// 고용주 회원가입
router.post("/signup/employer",authController.signupEmployer);

// 사용자 로그인
router.post("/login/user",  authController.loginuser);

// 고용주 로그인 
router.post("/login/employer",  authController.loginemployer);

// 로그인 유지
router.get("/me", isAuth, authController.me);

// 로그아웃
router.post("/logout", authController.logout);

// 회원 탈퇴
router.delete("/delete", isAuth, authController.deleteAccount);

// 이메일 찾기
router.post("/find-email", authController.findEmailController);

// 비밀번호 찾기 및 재설정
router.post("/find-password", authController.sendResetPasswordEmail);

export default router;
