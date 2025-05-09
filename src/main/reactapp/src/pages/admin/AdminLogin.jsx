// =======================================================================================
// AdminLogin.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 로그인 화면 (중앙 정렬 / ChatGPT 느낌 흰 배경)
// - Joy UI 컴포넌트 기반
// - 로그인 성공 시: /admin/dashboard 이동
// - 실패 시: 경고창 출력
// =======================================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Sheet,
    Typography,
    Input,
    Button,
    FormControl,
    FormLabel,
    Link
} from '@mui/joy';

import { loginAdmin } from '../../api/adminApi.js';   // ✅ 로그인 API 요청
import { saveToken } from '../../utils/tokenUtil.js';  // ✅ JWT 토큰 저장 유틸

export default function AdminLogin() {
    const [form, setForm] = useState({ adid: '', adpwd: '' }); // ✅ 로그인 폼 상태
    const navigate = useNavigate();

    // 입력 필드 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 로그인 요청 처리
    const handleLogin = async () => {
        try {
            const res = await loginAdmin(form);
            const token = res.data;
            saveToken(token);                     // 토큰 저장
            navigate('/admin/dashboard');         // 로그인 성공 시 이동
        } catch (err) {
            console.error('로그인 오류:', err);
            alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
        }
    };

    return (
        <Sheet
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#f9f9f9', // ✅ 흰 배경
            }}
        >
            <Box
                sx={{
                    width: 420,
                    bgcolor: '#ffffff',
                    p: 4,
                    borderRadius: '12px',
                    boxShadow: 'lg',
                    border: '1px solid #eee',
                }}
            >
                {/* 타이틀 */}
                <Typography
                    level="h4"
                    sx={{
                        mb: 3,
                        fontWeight: 'bold',
                        color: '#12b886',   // ✅ ChatGPT 느낌 포인트색
                        textAlign: 'center',
                    }}
                >
                    관리자 페이지
                </Typography>

                {/* 아이디 입력 */}
                <FormControl sx={{ mb: 2 }}>
                    <FormLabel>아이디</FormLabel>
                    <Input
                        name="adid"
                        placeholder="아이디를 입력하세요"
                        value={form.adid}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </FormControl>

                {/* 비밀번호 입력 */}
                <FormControl sx={{ mb: 3 }}>
                    <FormLabel>비밀번호</FormLabel>
                    <Input
                        type="password"
                        name="adpwd"
                        placeholder="비밀번호를 입력하세요"
                        value={form.adpwd}
                        onChange={handleChange}
                        variant="outlined"
                    />
                </FormControl>

                {/* 로그인 버튼 */}
                <Button
                    fullWidth
                    variant="solid"
                    color="success"
                    onClick={handleLogin}
                    sx={{ fontWeight: 'bold' }}
                >
                    로그인
                </Button>

                {/* 회원가입 링크 */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography level="body-sm" sx={{ color: '#555' }}>
                        계정이 없으신가요?{' '}
                        <Link
                            href="/admin/signup"
                            sx={{ color: '#12b886', fontWeight: 'bold' }}
                        >
                            회원가입
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Sheet>
    );
}