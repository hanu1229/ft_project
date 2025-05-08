// =======================================================================================
// AdminSignup.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 회원가입 화면
// - Joy UI 기반 + ChatGPT 스타일 (화이트 배경, 민트 포인트)
// =======================================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Sheet, Typography, Input, Button, FormControl,
    FormLabel, Link
} from '@mui/joy';
import { signupAdmin } from '../../api/adminApi.js'; // ✅ API 요청

export default function AdminSignup() {
    // ✅ 폼 입력 상태
    const [form, setForm] = useState({
        adid: '',
        adpwd: '',
        adname: '',
        adphone: '',
        adtype: 1 // 기본 승인 상태
    });

    const navigate = useNavigate();

    // ✅ 입력값 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ 회원가입 요청
    const handleSubmit = async () => {
        try {
            const res = await signupAdmin(form);
            if (res.data === true) {
                alert('🎉 회원가입 성공! 로그인 하세요.');
                navigate('/admin/login');
            } else {
                alert('❗ 실패: 중복 ID 또는 입력 누락');
            }
        } catch (err) {
            console.error('회원가입 실패:', err);
            alert('🚫 서버 오류');
        }
    };

    return (
        <Sheet
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#f8f9fa', // ✅ ChatGPT 느낌 흰 배경
            }}
        >
            <Box
                sx={{
                    width: 460,
                    bgcolor: '#ffffff',
                    p: 4,
                    borderRadius: '16px',
                    boxShadow: 'lg',
                    border: '1px solid #dee2e6',
                    color: '#212529'
                }}
            >
                {/* ✅ 상단 타이틀 */}
                <Typography
                    level="h4"
                    sx={{
                        color: '#12b886',
                        mb: 3,
                        fontWeight: 'bold',
                        textAlign: 'center',
                        letterSpacing: '0.5px'
                    }}
                >
                    관리자 회원가입
                </Typography>

                {/* ✅ 입력 필드들 */}
                {[
                    { name: 'adid', label: '아이디', placeholder: '아이디를 입력하세요' },
                    { name: 'adpwd', label: '비밀번호', placeholder: '비밀번호를 입력하세요', type: 'password' },
                    { name: 'adname', label: '이름', placeholder: '이름을 입력하세요' },
                    { name: 'adphone', label: '전화번호', placeholder: '010-xxxx-xxxx' },
                ].map((field, idx) => (
                    <FormControl key={idx} sx={{ mb: 2 }}>
                        <FormLabel sx={{ color: '#495057' }}>{field.label}</FormLabel>
                        <Input
                            name={field.name}
                            type={field.type || 'text'}
                            placeholder={field.placeholder}
                            value={form[field.name]}
                            onChange={handleChange}
                            variant="soft"
                        />
                    </FormControl>
                ))}

                {/* ✅ 회원가입 버튼 */}
                <Button
                    fullWidth
                    variant="solid"
                    color="success"
                    onClick={handleSubmit}
                    sx={{
                        fontWeight: 'bold',
                        bgcolor: '#12b886',
                        '&:hover': {
                            bgcolor: '#0ca678'
                        }
                    }}
                >
                    회원가입
                </Button>

                {/* ✅ 로그인 링크 */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography level="body-sm" sx={{ color: '#495057' }}>
                        이미 계정이 있으신가요?{' '}
                        <Link href="/admin/login" sx={{ color: '#087f5b', fontWeight: 'bold' }}>
                            로그인 하러가기
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Sheet>
    );
}