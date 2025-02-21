import User from "../models/userschema.js";
import Employer from "../models/employerschema.js";

// 사용자 회원가입
export async function createUser(userData) {
  const newUser = new User(userData);
  return await newUser.save();
}

// 고용주 회원가입
export async function createEmployer(employerData) {
  const newEmployer = new Employer(employerData);
  return await newEmployer.save();
}

// 일반 사용자 이메일로 조회
export async function findByEmail(email) {
  return await User.findOne({ email });
}

// 고용주 이메일로 조회
export async function findEmployerByBusinessNumber(businessNumber) {
  return await Employer.findOne({ businessNumber });
}

// 전화번호로 유저 찾기
export async function findByPhoneUser(phone_number) {
  return await User.findOne({ "phone.number": phone_number });
}

// 유저 정보 기반 이메일 찾기
export async function findEmailByUserInfo(username, phoneNumber) {
  const user = await User.findOne({ name: username, "phone.number": phoneNumber });
  return user ? user.email : null;
}

// 비밀번호 변경
export async function updatePassword(userId, newPassword) {
  return await User.findByIdAndUpdate(userId, { password: newPassword });
}
