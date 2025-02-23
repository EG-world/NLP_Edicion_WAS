import mongoose from "mongoose";
import * as JobData from '../data/job.js';
import { findUserById } from '../data/user.js';

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

// 사용자가 선택한 Job에 지원 (applicants 배열에 user의 _id 추가)
export async function applyForJobs(req, res) {
  try {
    const { userId, jobIds } = req.body;

    // 디버깅용
    // console.log("이력서 지원 시 req 데이터 확인: ", { userId, jobIds })

    if (!userId || !jobIds || !Array.isArray(jobIds) || jobIds.length === 0) {
      // console.error("유효하지 않은 요청 데이터:", { userId, jobIds });
      return res.status(400).json({ message: "잘못된 요청 데이터입니다." });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      // console.error("유효하지 않은 유저 ID 형식:", userId);
      return res.status(400).json({ message: "잘못된 유저 ID 형식입니다." });
    }

    const user = await findUserById(userId);
    if (!user) {
      // console.error("사용자를 찾을 수 없음:", userId);
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    let successfulApplications = [];
    let alreadyApplied = [];

    for (const jobId of jobIds) {
      if (!mongoose.Types.ObjectId.isValid(jobId)) {
        console.error("유효하지 않은 Job ID 형식:", jobId);
        continue;
      }

      // 디버깅용
      // console.log(`사용자: ${userId} -> 일자리: ${jobId} 지원 중`);

      const job = await JobData.findJobById(jobId);
      if (!job) {
        console.log("공고를 찾을 수 없음: ", jobId);
        continue;
      }

      // 이미 유저가 지원한 경우 프론트에 보여주기 위해 따로 배열에 저장
      if (job.applicants.includes(userId)) {
        alreadyApplied.push(jobId);
        console.warn(`사용자(${userId})가 이미 일자리(${jobId})에 지원함`);
        continue;
      }

      // 지원하기
      job.applicants.push(userId);
      await job.save();
      successfulApplications.push(jobId);
      console.log(`사용자: ${userId} -> 일자리: ${jobId} 지원 완료`);
    }

    res.status(200).json({
      message: "이력서 제출 성공",
      successfulApplications,
      alreadyApplied
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}
