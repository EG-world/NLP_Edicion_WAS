import mongoose from "mongoose";
import User from "../models/userschema.js";
import { config } from "../config.js";

// ✅ `.env`에서 직업명 배열 가져오기
const jobCategoryArray = config.jobs.jobCategory;

export async function findUserById(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    console.error("❌ 유효하지 않은 ObjectId:", userId);
    throw new Error("유효하지 않은 사용자 ID입니다.");
  }
  return await User.findById(userId);
}

export async function saveResumeData(userId, lorem, resume, jobObjective) {
  try {
    const user = await findUserById(userId);
    if (!user) {
      console.error("❌ 유저를 찾을 수 없음:", userId);
      throw new Error("해당 유저를 찾을 수 없습니다.");
    }

    // ✅ 직업명 배열 확인
    if (!jobCategoryArray || !Array.isArray(jobCategoryArray)) {
      console.error("❌ jobCategoryArray가 정의되지 않음:", jobCategoryArray);
      throw new Error("서버 설정 오류: JOB_CATEGORY_CODE 값을 확인하세요.");
    }

    // ✅ `jobCategoryArray` 값 출력하여 확인
    console.log("📌 직업명 리스트:", jobCategoryArray);
    console.log("📌 받은 jobObjective:", jobObjective);

    // ✅ 직업명을 숫자로 변환 (공백 제거 후 비교)
    const jobNumber = jobCategoryArray.findIndex(
      (job) => job.trim() === jobObjective.trim()
    );

    if (jobNumber === -1) {
      console.error(`❌ 유효하지 않은 jobObjective 값: ${jobObjective}`);
      throw new Error(`유효하지 않은 jobObjective 값: ${jobObjective}`);
    }

    console.log(`📌 변환된 jobObjective: ${jobObjective} → ${jobNumber + 1}`);

    // ✅ 유저 정보 업데이트
    user.lorem = lorem;
    user.resume = resume;
    user.jobObjective = jobNumber + 1; // 1부터 시작하는 인덱스로 저장
    user.updatedAt = new Date();

    await user.save();

    console.log("✅ 저장 완료! 업데이트된 유저 데이터:", {
      userId: user._id,
      jobObjective: user.jobObjective,
      lorem: user.lorem,
      resume: user.resume,
    });

    return user;
  } catch (error) {
    console.error("❌ 데이터 저장 중 오류 발생:", error.message);
    throw new Error("데이터 저장 실패");
  }
}
