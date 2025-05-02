// AdminLogin.jsx | rw 25-05-02 최종 리팩토링
// [설명] 넷플릭스 스타일 Joy UI 중앙 정렬 로그인 화면
//        - 관리자 전용 로그인 처리
//        - 성공 시 /admin/dashboard 이동
//        - 실패 시 경고창 출력
//        - Joy UI, dark mode 기반 스타일 적용

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
import { adminLogin } from '../../api/adminApi';
import { saveToken } from '../../utils/tokenUtil';

export default function AdminLogin() {
    const [form, setForm] = useState({ adid: '', adpwd: '' }); // ✅ 로그인 폼 상태
    const navigate = useNavigate();

    // =======================================================================================
    // ✅ 입력 필드 상태 갱신 핸들러
    // =======================================================================================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // =======================================================================================
    // ✅ 로그인 요청 처리
    // =======================================================================================
    const handleLogin = async () => {
        try {
            const res = await adminLogin(form);
            const token = res.data;
            saveToken(token);                  // JWT 토큰 저장
            navigate('/admin/dashboard');     // 로그인 성공 시 이동
        } catch (err) {
            console.error('로그인 오류:', err);
            alert('로그인 실패: 아이디 또는 비밀번호 확인');
        }
    };

    return (
        <Sheet
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                bgcolor: '#121212', // ✅ 다크 배경
            }}
        >
            <Box
                sx={{
                    width: 400,
                    bgcolor: '#1e1e1e',
                    p: 4,
                    borderRadius: '16px',
                    boxShadow: 'lg',
                    color: '#fff',
                }}
            >
                {/* ✅ 타이틀 */}
                <Typography
                    level="h4"
                    sx={{ color: '#ff4081', mb: 3, fontWeight: 'bold', textAlign: 'center' }}
                >
                    관리자 로그인
                </Typography>

                {/* ✅ 아이디 입력 필드 */}
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

                {/* ✅ 비밀번호 입력 필드 */}
                <FormControl sx={{ mb: 3 }}>
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

                {/* ✅ 로그인 버튼 */}
                <Button
                    fullWidth
                    variant="solid"
                    color="danger"
                    onClick={handleLogin}
                    sx={{ fontWeight: 'bold' }}
                >
                    로그인
                </Button>

                {/* ✅ 회원가입 링크 */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography level="body-sm" sx={{ color: '#ccc' }}>
                        계정이 없으신가요?{' '}
                        <Link href="/admin/signup" sx={{ color: '#ff80ab', fontWeight: 'bold' }}>
                            회원가입
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Sheet>
    );
}
