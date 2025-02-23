import Job from '../models/jobschema.js';

// categoryCode로 Job 조회
export async function getJobsByCategoryCode(categoryCode) {
  return await Job.find({ categoryCode });
}

// jobId로 Job 조회
export async function findJobById(jobId) {
  return await Job.findById(jobId);
}

// job에 지원자(userId) 추가 (중복 지원 방지)
export async function addApplicantToJob(jobId, userId) {
  const job = await findJobById(jobId);
  if (!job) {
    throw new Error("Job not found");
  }
  // 이미 지원한 경우 중복 추가 방지
  if (!job.applicants.includes(userId)) {
    job.applicants.push(userId);
    return await job.save();
  }
  return job;
}
