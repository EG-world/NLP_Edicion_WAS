import mongoose from 'mongoose'
import { virtualId } from './virtual.js'

const JobSchema = new mongoose.Schema({
    employerInfo: { type: mongoose.Schema.Types.ObjectId, ref: 'Employers', required: false, default: null }, // 공용주 정보 _id
    title: { type: String, required: false, default: null }, // 제목
    businessNumber: { type: String, required: false, default: null }, // 사업자 등록번호
    businessName: { type: String, required: true }, // 사업장 이름
    location: { type: String, required: true }, // 사업장 주소
    form: { type: String, required: true }, // 채용 형태
    payment: { type: String, required: true }, // 급여
    workHours: { type: String, required: false, default: null }, // 근무 시간
    benefits: { type: String, required: false, default: null }, // 혜택
    mainTasks: [
        { type: String, required: true } // 주요 업무
    ],
    employerEmail: { type: String, required: false, default: null }, // 고용자 이메일
    phoneNumber: { type: String, required: false, default: null }, // 고용자 전화번호
    content: { type: String, required: false, default: null }, // 코멘트
    categoryCode: { type: Number, required: true }, // 채용 공고 카테고리 코드
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // 이력서를 넣은 사용자 목록 (_id)
    preferred: { type: String, required: false, default: null }// 우대 조건, 원하는 인재상
})

// OverwriteModelError 방지 코드 추가
if (!mongoose.models.Job) {
    virtualId(JobSchema);
}

// 기존 모델이 있으면 재사용
export default mongoose.models.Job || mongoose.model("Job", JobSchema);
