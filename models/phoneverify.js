import mongoose from 'mongoose'
import { virtualId } from './virtual.js'

const UserVerifySchema = new mongoose.Schema({
    phone: {
        number: { type: String, required: true }, // 휴대폰 번호
        verified: { type: Boolean, default: false }, // 인증 여부
        verificationCode: { type: String } // 발송된 인증번호
    }
})

// OverwriteModelError 방지 코드 추가
if (!mongoose.models.UserVerify) {
    virtualId(UserVerifySchema);
}

// 기존 모델이 있으면 재사용
export default mongoose.models.UserVerify || mongoose.model("UserVerify", UserVerifySchema);