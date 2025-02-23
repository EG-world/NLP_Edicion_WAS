import mongoose from "mongoose";
import { virtualId } from "./virtual.js";

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true }, // 이름
  password: { type: String, required: true }, // 비밀번호
  phone: {
    number: { type: String, required: true, unique: true }, // 휴대폰 번호
    verified: { type: Boolean, default: false }, // 인증 여부
  },
  email: { type: String, required: true, unique: true }, // 이메일
  gender: { type: String, enum: ["남", "여"], required: true }, // 성별
  birth: { type: Date, required: true }, // 생년월일
  education: [
    {
      graduated: { type: String, default: null },  // 졸업 여부
      department: { type: String, default: null },  // 학과과
    }
  ], // 학력
  termsAgreed: {
    // 약관 동의 정보
    requiredTerms: { type: Boolean, default: true }, // 필수 약관 동의
    optionalTerms: { type: Boolean, default: false }, // 선택 약관 동의
  },
  license: [
    {
      name: { type: String, default: null }, // 자격증 이름
      date: { type: Date, default: null }, // 자격증 취득 날짜
    },
  ],
  history: [
    {
      title: { type: String, default: null }, // 경력 타이틀
      date: { type: String, default: null }, // 경력 일자
      content: { type: String, default: null }, // 경력 내용
    },
  ],
  talentedType: { type: Number, default: null }, // 인재상 유형
  jobObjective: { type: Number, default: null }, // 희망 직무
  lorem: { type: String, default: null }, // 두서없는 말
  resume: { type: String, default: null }, // 자기소개
  createdAt: { type: Date, default: Date.now }, // 가입 일시
  updatedAt: { type: Date, default: Date.now }, // 마지막 수정 일시
});


virtualId(UserSchema)

// overwirtemodelerror 방지 코드 
const User = mongoose.models.User || mongoose.model("User", UserSchema);

export default User
