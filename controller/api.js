import * as userData from "../data/api.js";

// ✅ 자기소개서 저장 API
export async function saveResume(req, res) {
  const { userId, lorem, resume, jobObjective } = req.body;
  console.log("📌 [Controller] 요청 데이터:", req.body);

  if (!userId) {
    console.error("❌ userId가 제공되지 않음");
    return res.status(400).json({ message: "userId가 필요합니다." });
  }

  try {
    const updatedUser = await userData.saveResumeData(userId, lorem, resume, jobObjective);

    console.log("✅ [Controller] 저장 완료. 응답 데이터:", updatedUser);
    res.status(200).json({
      message: "자기소개서 저장 성공!",
      userId: updatedUser._id,
      jobObjective: updatedUser.jobObjective,
      lorem: updatedUser.lorem,
      resume: updatedUser.resume,
      updatedAt: updatedUser.updatedAt,
    });
  } catch (error) {
    console.error("❌ [Controller] 자기소개서 저장 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류 발생", error: error.message });
  }
}
