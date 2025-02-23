import mongoose from "mongoose";
import User from "../models/userschema.js";

// ✅ userId를 MongoDB의 `_id`로 변환하여 검색
export async function findUserByUserId(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("❌ 유효하지 않은 ObjectId:", userId);
    throw new Error("유효하지 않은 사용자 ID입니다.");
  }
  return await User.findById(new mongoose.Types.ObjectId(userId));  // ✅ `_id` 변환 후 검색
}

export async function saveResumeData(userId, lorem, resume, jobObjective) {
    if (typeof userId === "object" && userId.userId) {
        userId = userId.userId;  // ✅ 객체일 경우 `userId` 값만 추출
    }

    const user = await findUserByUserId(userId);
    if (!user) {
        console.error("❌ 유저를 찾을 수 없음:", userId);
        throw new Error("해당 유저를 찾을 수 없습니다.");
    }

    // ✅ 유저 정보 업데이트
    user.lorem = lorem;
    user.resume = resume;
    user.jobObjective = jobObjective;
    user.updatedAt = new Date();

    return await user.save();
}
