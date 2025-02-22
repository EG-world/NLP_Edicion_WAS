import * as userData from '../data/user.js';

// 내 정보 조회
export async function getMyInfo(req, res) {
  const { userId } = req.params;
  try {
    const user = await userData.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: '해당 유저를 찾을 수 없습니다.' });
    }
    // 비밀번호 제외
    const { password, ...userInfo } = user.toObject();
    res.status(200).json(userInfo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러' });
  }
}
