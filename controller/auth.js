import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.js";
import User from "../models/userschema.js";
import Employer from "../models/employerschema.js";
import { hashPassword, generateTemporaryPassword } from "../utils/password.js";
import { sendEmail } from "../utils/email.js";

// ✅ JWT 토큰 생성 (환경변수 적용)
async function createJwtToken(id, userType = "user") {
    const secretKey = userType === "employer" ? config.jwt.employer_secretKey : config.jwt.user_secretKey;
    return jwt.sign({ id }, secretKey, { expiresIn: config.jwt.expiresInSec });
}

// ✅ 사용자 회원가입 (MongoDB)
export async function signup(req, res) {
    console.log('controller 회원가입시작')
    try {
      const { userId, name, email, phoneNumber, gender, birth, password } = req.body;
  
      console.log("회원가입 요청:", userId, name, email, phoneNumber, gender, birth);
  
      // ✅ 이메일 중복 체크
      const foundEmail = await User.findOne({ email });
      if (foundEmail) {
        return res.status(409).json({ message: "이미 가입된 이메일입니다." });
      }
  
      // ✅ 전화번호 중복 체크
      const foundPhone = await User.findOne({ "phone.number": phoneNumber });
      if (foundPhone) {
        return res.status(409).json({ message: "이미 가입된 전화번호입니다." });
      }
  
      // ✅ 비밀번호 해싱 후 저장
      const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
  
      const newUser = new User({
        userId,
        name,
        email,
        phone: { number: phoneNumber, verified: false },
        gender,
        birth, // ✅ 이미 `router/auth.js`에서 유효성 검증됨 → 변환 불필요
        password: hashedPassword,
      });
  
      await newUser.save();
      const token = await createJwtToken(newUser._id);
  
      res.status(201).json({ token, email });
    } catch (err) {
      console.error("회원가입 중 오류 발생:", err); // ✅ 서버 오류 확인용 로그
      res.status(500).json({ message: "회원가입 중 오류 발생", error: err.message });
    }
  }

// ✅ 고용주 회원가입 (MongoDB)
export async function signupEmployer(req, res) {
    try {
        const { businessNumber, name, password, email, phoneNumber } = req.body;

        const foundEmail = await Employer.findOne({ email });
        if (foundEmail) {
            return res.status(409).json({ message: `${email}이 이미 등록되었습니다.` });
        }

        const foundBusiness = await Employer.findOne({ businessNumber });
        if (foundBusiness) {
            return res.status(409).json({ message: "이미 등록된 사업자 번호입니다." });
        }

        const hashedPassword = await bcrypt.hash(password, config.bcrypt.saltRounds);
        const newEmployer = new Employer({
            businessNumber,
            name,
            password: hashedPassword,
            email,
            phoneNumber,
        });

        await newEmployer.save();
        const token = await createJwtToken(newEmployer._id, "employer");

        res.status(201).json({ token, email });
    } catch (err) {
        res.status(500).json({ message: "고용주 회원가입 중 오류 발생", error: err.message });
    }
}

// ✅ 로그인 (MongoDB)
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "이메일을 찾을 수 없습니다." });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
        }

        const token = await createJwtToken(user._id);
        res.status(200).json({ success: true, message: "로그인 성공", token, id: user._id, username: user.name });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "서버 오류로 로그인에 실패했습니다." });
    }
}

// ✅ 로그인(토큰) 유지
export async function me(req, res) {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "일치하는 사용자가 없습니다." });
        }

        res.status(200).json({ token: req.token, id: user._id });
    } catch (error) {
        res.status(500).json({ message: "서버 오류 발생" });
    }
}

// ✅ 로그아웃
export const logout = (req, res) => {
    try {
        console.log(`User ID: ${req.userId} 로그아웃`);
        res.json({ success: true, message: "로그아웃 되었습니다. 브라우저에서 토큰을 삭제해주세요." });
    } catch (error) {
        res.status(500).json({ message: "서버 오류로 로그아웃에 실패했습니다." });
    }
};

// ✅ 회원 탈퇴
export async function deleteAccount(req, res) {
    try {
        const userId = req.userId;
        await User.findByIdAndDelete(userId);
        console.log(`User ID: ${userId} 계정 삭제`);
        res.status(200).json({ message: "계정이 성공적으로 삭제되었습니다." });
    } catch (error) {
        res.status(500).json({ message: "서버 오류로 인해 계정 삭제에 실패했습니다." });
    }
}

// ✅ 이메일 찾기
export async function findEmailController(req, res) {
    try {
        const { name, phoneNumber } = req.body;
        if (!name || !phoneNumber) {
            return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
        }

        const user = await User.findOne({ name, "phone.number": phoneNumber });
        if (!user) {
            return res.status(404).json({ message: "일치하는 사용자를 찾을 수 없습니다." });
        }

        res.status(200).json({ email: user.email });
    } catch (error) {
        res.status(500).json({ message: "서버 오류 발생" });
    }
}

// ✅ 비밀번호 찾기 및 재설정
export async function sendResetPasswordEmail(req, res) {
    try {
        const { name, phoneNumber, email } = req.body;
        if (!name || !phoneNumber || !email) {
            return res.status(400).json({ message: "모든 필드를 입력해야 합니다." });
        }

        const user = await User.findOne({ name, "phone.number": phoneNumber, email });
        if (!user) {
            return res.status(404).json({ message: "일치하는 사용자를 찾을 수 없습니다." });
        }

        const temporaryPassword = generateTemporaryPassword();
        const hashedPassword = await hashPassword(temporaryPassword);

        await User.findByIdAndUpdate(user._id, { password: hashedPassword });

        await sendEmail({ 
            to: email, 
            subject: "임시 비밀번호 발급", 
            text: `임시 비밀번호: ${temporaryPassword}\n로그인 후 변경하세요.` 
        });

        res.status(200).json({ message: "임시 비밀번호가 이메일로 전송되었습니다." });
    } catch (error) {
        res.status(500).json({ message: "이메일 전송 중 오류가 발생했습니다." });
    }
}
