import * as userData from "../data/api.js";

// ✅ 자기소개서 저장 API
export async function saveResume(req, res) {
  const { userId, lorem, resume, jobObjective } = req.body;
  console.log(userId)

  if (!userId) {
    return res.status(400).json({ message: "userId가 필요합니다." });
  }

  try {
    const updatedUser = await userData.saveResumeData(userId, lorem, resume, jobObjective);
    res.status(200).json({ message: "자기소개서가 성공적으로 저장되었습니다.", updatedUser });
  } catch (error) {
    console.error("자기소개서 저장 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류 발생" });
  }
}
