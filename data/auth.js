import User from "../models/userschema.js";
import Employer from "../models/employerschema.js";

// 일반 사용자 이메일로 조회
export async function findByEmail(email) {
  return await User.findOne({ email });
}

// 고용주 이메일로 조회
export async function findEmployerByEmail(email) {
  return await Employer.findOne({ email });
}

// 전화번호로 유저 찾기
export async function findByPhone(phone_number) {
  return await User.findOne({ "phone.number": phone_number });
}

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

// ID로 유저 찾기
export async function findById(id) {
  return await User.findById(id);
}

// ID로 고용주 찾기
export async function findEmployerById(id) {
  return await Employer.findById(id);
}

// 회원 탈퇴 (일반 사용자)
export async function deleteUserById(id) {
  return await User.findByIdAndDelete(id);
}

// 회원 탈퇴 (고용주)
export async function deleteEmployerById(id) {
  return await Employer.findByIdAndDelete(id);
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
