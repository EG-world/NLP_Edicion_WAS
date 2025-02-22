import User from '../models/userschema.js';

// userId로 유저 정보 조회
export async function findUserByUserId(userId) {
  return await User.findOne({ userId });
}

// user의 _id 로 찾는 함수
export async function findUserById(id) {
    return User.findById(id);
  }
