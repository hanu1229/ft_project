// AdminSignup.jsx | rw 25-05-02 최종 리팩토링
// [설명] Joy UI 기반 관리자 전용 회원가입 화면
//        - 중앙 정렬 / 넷플릭스 다크 테마 UI 적용
//        - 필수 필드 입력 및 서버 응답 처리

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Sheet, Typography, Input, Button, FormControl,
    FormLabel, Link
} from '@mui/joy';
import { signupAdmin } from '../../api/adminApi';

export default function AdminSignup() {
    // ✅ 회원가입 폼 상태값
    const [form, setForm] = useState({
        adid: '',
        adpwd: '',
        adname: '',
        adphone: '',
        adtype: 1 // 기본 승인 상태
    });

    const navigate = useNavigate();

    // =======================================================================================
    // ✅ 입력값 변경 핸들러
    // =======================================================================================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // =======================================================================================
    // ✅ 회원가입 처리 핸들러
    // =======================================================================================
    const handleSubmit = async () => {
        try {
            const res = await signupAdmin(form);
            if (res.data === true) {
                alert('🎉 회원가입 성공! 이제 로그인하세요.');
                navigate('/admin/login');
            } else {
                alert('❗ 실패: 중복된 ID 또는 필수 입력 누락');
            }
        } catch (err) {
            console.error('회원가입 오류:', err);
            alert('🚫 서버 오류로 회원가입 실패');
        }
    };

    return (
        <Sheet
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#121212'
            }}
        >
            <Box
                sx={{
                    width: 450,
                    bgcolor: '#1e1e1e',
                    p: 4,
                    borderRadius: '16px',
                    boxShadow: 'lg',
                    color: '#fff'
                }}
            >
                {/* ✅ 타이틀 */}
                <Typography
                    level="h4"
                    sx={{ color: '#ff4081', mb: 3, fontWeight: 'bold', textAlign: 'center' }}
                >
                    관리자 회원가입
                </Typography>

                {/* ✅ 아이디 입력 */}
                <FormControl sx={{ mb: 2 }}>
                    <FormLabel sx={{ color: '#ccc' }}>아이디</FormLabel>
                    <Input
                        name="adid"
                        placeholder="아이디를 입력하세요"
                        value={form.adid}
                        onChange={handleChange}
                        variant="soft"
                    />
                </FormControl>

                {/* ✅ 비밀번호 입력 */}
                <FormControl sx={{ mb: 2 }}>
                    <FormLabel sx={{ color: '#ccc' }}>비밀번호</FormLabel>
                    <Input
                        type="password"
                        name="adpwd"
                        placeholder="비밀번호를 입력하세요"
                        value={form.adpwd}
                        onChange={handleChange}
                        variant="soft"
                    />
                </FormControl>

                {/* ✅ 이름 입력 */}
                <FormControl sx={{ mb: 2 }}>
                    <FormLabel sx={{ color: '#ccc' }}>이름</FormLabel>
                    <Input
                        name="adname"
                        placeholder="이름을 입력하세요"
                        value={form.adname}
                        onChange={handleChange}
                        variant="soft"
                    />
                </FormControl>

                {/* ✅ 전화번호 입력 */}
                <FormControl sx={{ mb: 3 }}>
                    <FormLabel sx={{ color: '#ccc' }}>전화번호</FormLabel>
                    <Input
                        name="adphone"
                        placeholder="010-xxxx-xxxx"
                        value={form.adphone}
                        onChange={handleChange}
                        variant="soft"
                    />
                </FormControl>

                {/* ✅ 가입 버튼 */}
                <Button
                    fullWidth
                    variant="solid"
                    color="danger"
                    onClick={handleSubmit}
                    sx={{ fontWeight: 'bold' }}
                >
                    회원가입
                </Button>

                {/* ✅ 로그인 링크 */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography level="body-sm" sx={{ color: '#ccc' }}>
                        이미 계정이 있으신가요?{' '}
                        <Link href="/admin/login" sx={{ color: '#ff80ab', fontWeight: 'bold' }}>
                            로그인 하러가기
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Sheet>
    );
}