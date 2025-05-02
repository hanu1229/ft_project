// AdminSignup.jsx | rw 25-05-01
// [설명] 관리자 전용 회원가입 화면 (Joy UI 기반)
//        - 입력값: adid, adpwd, adname, adphone, adtype
//        - 요청 전송 시 모든 값 포함 (Talend 테스트 대비)
//        - 가입 성공 시 로그인 페이지로 이동

import React, { useState } from 'react';                         // [1] React 및 훅 import
import {
    Box,
    Button,
    Typography,
    Input,
    FormControl,
    FormLabel,
    Sheet
} from '@mui/joy';                                              // [2] Joy UI 컴포넌트 import
import { useNavigate } from 'react-router-dom';                 // [3] 페이지 이동용 훅
import { signupAdmin } from '../../api/adminApi';              // [4] 관리자 회원가입 API 함수
import { removeToken } from '../../utils/tokenUtil';           // [5] 토큰 초기화 유틸 (선택적 사용)

export default function AdminSignup() {
    const navigate = useNavigate(); // [6] 페이지 이동 핸들러

    // ✅ [7] 폼 입력값 상태 정의 (모든 API 필드 포함)
    const [form, setForm] = useState({
        adid: '',
        adpwd: '',
        adname: '',
        adphone: '',
        adtype: '0', // 관리자 기본 상태값 (0: 신청)
    });

    // ✅ [8] 입력값 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ [9] 회원가입 요청 함수
    const handleSubmit = async () => {
        try {
            await signupAdmin(form); // 모든 값 포함된 상태로 전송
            alert('회원가입 성공! 로그인 페이지로 이동합니다.');
            removeToken(); // 혹시 기존 로그인된 토큰 제거
            navigate('/admin/login'); // 로그인 페이지로 이동
        } catch (err) {
            console.error('회원가입 실패:', err);
            alert('회원가입 실패: ' + (err.response?.data?.message || '서버 오류'));
        }
    };

    return (
        <Sheet
            sx={{
                width: 400,
                mx: 'auto',
                my: 5,
                p: 4,
                borderRadius: 'lg',
                boxShadow: 'md',
                bgcolor: 'neutral.softBg'
            }}
        >
            {/* ✅ 제목 영역 */}
            <Typography level="h4" sx={{ mb: 2 }}>
                관리자 회원가입
            </Typography>

            {/* ✅ 아이디 입력 */}
            <FormControl sx={{ mb: 2 }}>
                <FormLabel>아이디</FormLabel>
                <Input name="adid" value={form.adid} onChange={handleChange} />
            </FormControl>

            {/* ✅ 비밀번호 입력 */}
            <FormControl sx={{ mb: 2 }}>
                <FormLabel>비밀번호</FormLabel>
                <Input
                    type="password"
                    name="adpwd"
                    value={form.adpwd}
                    onChange={handleChange}
                />
            </FormControl>

            {/* ✅ 이름 입력 */}
            <FormControl sx={{ mb: 2 }}>
                <FormLabel>이름</FormLabel>
                <Input name="adname" value={form.adname} onChange={handleChange} />
            </FormControl>

            {/* ✅ 전화번호 입력 */}
            <FormControl sx={{ mb: 2 }}>
                <FormLabel>전화번호</FormLabel>
                <Input name="adphone" value={form.adphone} onChange={handleChange} />
            </FormControl>

            {/* ✅ (고정) 관리자 상태코드 입력값 */}
            <FormControl sx={{ mb: 2 }}>
                <FormLabel>관리자 상태코드</FormLabel>
                <Input name="adtype" value={form.adtype} readOnly />
            </FormControl>

            {/* ✅ 제출 버튼 */}
            <Button onClick={handleSubmit} color="primary" fullWidth>
                회원가입
            </Button>
        </Sheet>
    );
}