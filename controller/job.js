import mongoose from "mongoose";
import * as JobData from '../data/job.js';
import { findUserById } from '../data/user.js';
import User from "../models/userschema.js";

// 사용자 jobObjective와 동일한 categoryCode를 가진 Job 목록 반환
export async function getJobsByUserSkills(req, res) {
  try {
    const userId = req.params.userId;
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    const jobObjective = user.jobObjective; // 사용자 관심 직군
    const jobs = await JobData.getJobsByCategoryCode(jobObjective);

    res.status(200).json(jobs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}

// 사용자 정보(lorem) 반환
export async function getUerInfo(req, res) {
  try {
    const { userId } = req.params;

    // 디버깅용
    // console.log("요청 userID", userId);

    if (!userId) {
      return res.status(400).json({ message: "userId 값을 찾을 수 없습니다."});
    }

    const user = await User.findById(userId).select("lorem");
    
    // 디버깅용
    // console.log("사용자 info: ", user)

    if (!user) {
      return res.status(404).json({ message: "사용자의 정보를 찾을 수 없습니다." })
    }
    res.status(200).json({
      lorem: user.lorem || null
    });
  } catch (error) {
    console.error("사용자 정보 조회 실패", error);
    res.status(500).json({ message: "서버 내부 오류 발생" });
  }
}

// 사용자가 선택한 Job에 지원
export async function applyForJobs(req, res) {
  try {
    const { userId, applicantsData } = req.body;

    // 디버깅용 콘솔 출력
    console.log("이력서 지원 시 req 데이터 확인: ", { userId, applicantsData });

    if (!userId || !applicantsData || !Array.isArray(applicantsData)) {
      console.error("유효하지 않은 요청 데이터:", { userId, applicantsData });
      return res.status(400).json({ message: "잘못된 요청 데이터입니다." });
    }

    // 사용자 존재 여부 확인
    const user = await User.findById(userId);
    if (!user) {
      console.error("사용자를 찾을 수 없음:", userId);
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // MongoDB ObjectId로 변환
    const formattedApplicants = applicantsData.map((app) => ({
      jobId: new mongoose.Types.ObjectId(app.jobId), // ObjectId 변환
      applicants: app.applicants,
    }));

    console.log("변환된 applicantsData:", formattedApplicants);

    // 지원자 추가 처리
    const successfulApplications = await JobData.addApplicantToJobs(formattedApplicants);

    res.status(200).json({
      message: "이력서 제출 성공",
      successfulApplications,
    });
  } catch (error) {
    console.error("서버 오류", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}
