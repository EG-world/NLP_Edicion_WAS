import mongoose from 'mongoose'
import { virtualId } from './virtual.js'

const EmployerSchema = new mongoose.Schema({
    businessNumber: { type: String, required: true, unique: true }, // 사업자 등록번호
    name: { type: String, required: true }, // 이름
    password: { type: String, required: true }, // 비밀번호
    email: { type: String, required: true, unique: true }, // 이메일
    phoneNumber: { type: String, required: true, unique: true } // 휴대폰 번호
})


// 가상 필드 ID 추가 (OverwriteModelError 방지)
if (!mongoose.models.Employer) {
    virtualId(EmployerSchema);
}

// OverwriteModelError 방지 코드 추가
export default mongoose.models.Employer || mongoose.model("Employer", EmployerSchema);