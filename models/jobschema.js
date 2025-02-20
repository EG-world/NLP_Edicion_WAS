import mongoose from 'mongoose'
import { virtualId } from './virtual.js'

const JobSchema = new mongoose.Schema({
    employerInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employers', required: true }, // 공용주 정보 _id
    title: { type: String, required: true }, // 제목
    businessNumber: { type: String, required: true, unique: true }, // 사업자 등록번호
    businessName: { type: String, required: true }, // 사업장 이름
    location: { type: String, required: true }, // 사업장 주소
    form: { type: String, required: true }, // 채용 형태
    payment: { type: Number, required: true }, // 급여
    workHours: { type: String, required: true }, // 근무 시간
    benefits: { type: String, required: true }, // 혜택
    mainTasks: [
        { type: String, required: true } // 주요 업무
    ],
    employerEmail: { type: String, required: true }, // 고용자 이메일
    phoneNumber: { type: String, required: true }, // 고용자 전화번호
    content: { type: String, required: true } // 코멘트
})

// OverwriteModelError 방지 코드 추가
if (!mongoose.models.Job) {
    virtualId(JobSchema);
}

// 기존 모델이 있으면 재사용
export default mongoose.models.Job || mongoose.model("Job", JobSchema);
