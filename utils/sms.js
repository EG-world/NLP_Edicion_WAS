import coolsms from 'coolsms-node-sdk'
import { config } from '../config.js';

export async function sendTokenToSMS(phone, jobInfo) {
    const mysms = coolsms.default;
    const messageService = new mysms(config.api.apiKey, config.api.apiSecretKey);

    if (!jobInfo) {
        console.error("사업 정보가 없습니다.");
        return;
    }

    const text = `[Edicion]
안녕하세요 [${jobInfo.title}] 채용 공고 올린 관계자입니다.
추천 인재 보고 연락 드립니다. 관심 있으시면 아래의 전화번호로 연락 주세요!
채용 공고 내용: ${jobInfo.content}
연락처: ${jobInfo.phoneNumber}`;

    try {
        const result = await messageService.sendOne({
            to: phone,
            from: `${config.api.hpNumber}`,
            text: text
        });
        return result;
    } catch (err) {
        console.error("발송 실패:", err);
        return;
    }
}
