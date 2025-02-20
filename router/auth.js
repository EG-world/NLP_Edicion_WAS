import express from "express";
import * as authController from "../controller/auth.js";
import { body } from "express-validator";
import { validate } from "../middleware/validator.js";
import { isAuth } from "../middleware/auth.js";

const router = express.Router();

// 로그인 유효성 검증
const validateLogin = [
  body("email").trim().isEmail().withMessage("유효한 이메일을 입력하세요."),
  body("password").trim().isLength({ min: 8 }).withMessage("비밀번호는 최소 8자 이상 입력해야 합니다."),
  validate,
];

// 회원가입 유효성 검증
const validateSignup = [
  body("email").trim().isEmail().withMessage("유효한 이메일을 입력하세요."),
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("비밀번호는 최소 8자 이상 입력해야 합니다."),
  body("passwordConfirm")
    .trim()
    .isLength({ min: 8 })
    .withMessage("비밀번호 확인은 8자 이상 입력해야 합니다."),
  
  body("name")
    .trim()
    .notEmpty()
    .matches(/^[a-zA-Z0-9가-힣]*$/)
    .isLength({ min: 2, max: 10 })
    .withMessage("이름은 2자 이상 10자 이내여야 합니다."),
  
  body("phoneNumber")
    .trim()
    .isLength({ min: 11, max: 11 })
    .matches(/^[0-9]+$/)
    .withMessage("휴대폰 번호는 11자리 숫자만 입력해야 합니다."),

  // ✅ 생년월일 검증 (YYYY-MM-DD 형식 체크)
  body("birth")
    .trim()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage("생년월일은 YYYY-MM-DD 형식이어야 합니다.")
    .custom((value) => {
      const birthDate = new Date(value);
      const [year, month, day] = value.split("-").map(Number);

      if (
        isNaN(birthDate.getTime()) || // 유효한 날짜인지 확인
        birthDate.getFullYear() !== year ||
        birthDate.getMonth() + 1 !== month || // JavaScript에서 월이 0부터 시작하므로 +1 필요
        birthDate.getDate() !== day
      ) {
        throw new Error("유효하지 않은 생년월일입니다.");
      }

      return true;
    }),

  validate,
];

// 사용자 회원가입
router.post("/signup", validateSignup, authController.signup);

// 고용주 회원가입
router.post("/signup/employer", authController.signupEmployer);

// 로그인
router.post("/login", validateLogin, authController.login);

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
