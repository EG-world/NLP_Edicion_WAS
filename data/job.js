import Job from '../models/jobschema.js';

// categoryCode로 Job 조회
export async function getJobsByCategoryCode(categoryCode) {
  return await Job.find({ categoryCode });
}

// jobId로 Job 조회
export async function findJobById(jobId) {
  return await Job.findById(jobId);
}

// job에 지원자(userId, fitness) 추가
export async function addApplicantToJob(jobId, userId, fitness) {
  const job = await findJobById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }

  job.applicants.push({ userId, fitness });
  return await job.save();
}

// 여러 공고 지원하기
export async function addApplicantToJobs(applicantsData) {
  let successfulApplications = [];

  for (const { jobId, applicants } of applicantsData) {
    if (!jobId || !applicants || !applicants.userId) {
      console.error("유효한 jobId 또는 applicants가 아님", { jobId, applicants });
      continue;
    }

    try {
      const job = await findJobById(jobId);
      if(!job) {
        console.warn("공고를 찾을 수 없음", jobId);
        continue;
      }

      // 개별 지원자 객체 처리
      job.applicants.push({
        user: applicants.userId,
        fitness: applicants.fitness || null
      });

      await job.save();
      successfulApplications.push(jobId);
      console.log(`${jobId} 지원 성공`);
    } catch (error) {
      console.error(`${jobId} 지원 오류`, error);
    }
  }

  return successfulApplications;
}

// 특정 카테고리의 채용 공고 조회
export async function getJobsByCategory(categoryCode) {
  try {
      const categoryNumber = parseInt(categoryCode, 10);

      if (!categoryNumber || isNaN(categoryNumber) || categoryNumber < 1 || categoryNumber > 10) {
          throw new Error("유효한 카테고리 코드(1~10)가 필요합니다.");
      }

      const jobs = await Job.find({ categoryCode: categoryNumber });

      return jobs;
  } catch (error) {
      console.error("카테고리별 공고 조회 오류:", error);
      throw new Error("채용 공고를 불러오는 중 오류 발생");
  }
}