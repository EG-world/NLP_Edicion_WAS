import { body, validationResult } from "express-validator";

// 검증 결과 처리 미들웨어
export const validate = (req, res, next) => {
    const errors = validationResult(req)
    if(errors.isEmpty()){
        return next()
    }
    return res.status(400).json({message: errors.array()[0].msg})
}

// 비밀번호 변경 유효성 검사
export const validatePasswordChange = [
    // 현재 비밀번호
    body('currentPassword')
        .trim()
        .notEmpty()
        .withMessage('현재 비밀번호를 입력해주세요.'),

    // 새 비밀번호
    body('newPassword')
        .trim()
        .isLength({ min: 8 })
        .withMessage('비밀번호는 8자 이상이어야 합니다.'),

    // 새 비밀번호 확인
    body('confirmPassword')
        .trim()
        .isLength({ min: 8 })
        .withMessage('비밀번호 확인은 8자 이상이어야 합니다.')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('비밀번호 확인이 일치하지 않습니다.');
            }
            return true;
        }),

    // 검증 결과 처리
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }
        next();
    }
];