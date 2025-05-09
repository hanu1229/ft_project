// =======================================================================================
// AdminSignup.jsx | rw 25-05-08 최종 통합 리팩토링본
// [설명]
// - Joy UI 기반 관리자 회원가입 화면
// - 비밀번호 보기/숨기기 toggle + 유효성 검사 + Snackbar 알림 통합 적용
// =======================================================================================

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Sheet, Typography, Input, Button, FormControl,
    FormLabel, Link, Divider, Snackbar, Alert, IconButton
} from '@mui/joy';
import {
    FaUser, FaLock, FaSignature, FaPhoneAlt
} from 'react-icons/fa';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

import { signupAdmin } from '../../api/adminApi';

export default function AdminSignup() {
    const navigate = useNavigate();

    // ✅ 입력 폼 상태
    const [form, setForm] = useState({
        adid: '',
        adpwd: '',
        adpwdCheck: '',
        adname: '',
        adphone: '',
        adtype: 1
    });

    // ✅ 보기/숨기기 상태
    const [showPwd, setShowPwd] = useState(false);
    const [showPwdCheck, setShowPwdCheck] = useState(false);

    // ✅ Snackbar 상태
    const [snackbar, setSnackbar] = useState({ open: false, message: '', color: 'danger' });

    // ✅ 입력 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ 유효성 검사 함수들
    const isIdValid = /^[a-zA-Z0-9]{4,20}$/.test(form.adid);
    const isPwdValid = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,20}$/.test(form.adpwd);
    const isPhoneValid = /^010-\d{4}-\d{4}$/.test(form.adphone);
    const isPwdMatch = form.adpwd === form.adpwdCheck;

    // ✅ 회원가입 시도
    const handleSubmit = async () => {
        if (!isIdValid) return showSnackbar('❗ 아이디는 4~20자의 영문/숫자만 허용됩니다.');
        if (!isPwdValid) return showSnackbar('❗ 비밀번호는 문자+숫자 조합 8~20자여야 합니다.');
        if (!isPwdMatch) return showSnackbar('❗ 비밀번호가 일치하지 않습니다.');
        if (!isPhoneValid) return showSnackbar('❗ 전화번호 형식이 잘못되었습니다. (예: 010-1234-5678)');
        if (!form.adname) return showSnackbar('❗ 이름을 입력해주세요.');

        try {
            const { adpwdCheck, ...submitForm } = form;
            const res = await signupAdmin(submitForm);
            if (res.data === true) {
                showSnackbar('🎉 회원가입 성공! 로그인 하세요.', 'success');
                setTimeout(() => navigate('/admin/login'), 1500);
            } else {
                showSnackbar('❗ 실패: 중복 ID 또는 입력 누락');
            }
        } catch (err) {
            console.error('회원가입 실패:', err);
            showSnackbar('🚫 서버 오류');
        }
    };

    // ✅ Snackbar 호출 함수
    const showSnackbar = (message, color = 'danger') => {
        setSnackbar({ open: true, message, color });
    };

    return (
        <Sheet
            sx={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh',
                bgcolor: '#f8f9fa'
            }}
        >
            <Box
                sx={{
                    width: 460, bgcolor: '#ffffff', p: 4, borderRadius: '16px',
                    boxShadow: 'lg', border: '1px solid #dee2e6', color: '#212529'
                }}
            >
                <Typography level="h4" sx={{ color: '#12b886', mb: 1, fontWeight: 'bold', textAlign: 'center' }}>
                    관리자 회원가입
                </Typography>
                <Divider sx={{ mb: 3 }} />

                {/* ✅ 아이디 */}
                <FormControl sx={{ mb: 2 }}>
                    <FormLabel>아이디</FormLabel>
                    <Input
                        name="adid"
                        placeholder="영문/숫자 4~20자"
                        value={form.adid}
                        onChange={handleChange}
                        startDecorator={<FaUser />}
                        variant="soft"
                        color={form.adid && !isIdValid ? 'danger' : 'neutral'}
                    />
                </FormControl>

                {/* ✅ 비밀번호 */}
                <FormControl sx={{ mb: 2 }}>
                    <FormLabel>비밀번호</FormLabel>
                    <Input
                        name="adpwd"
                        type={showPwd ? 'text' : 'password'}
                        placeholder="문자+숫자 8~20자"
                        value={form.adpwd}
                        onChange={handleChange}
                        startDecorator={<FaLock />}
                        endDecorator={
                            <IconButton variant="plain" onClick={() => setShowPwd(!showPwd)} size="sm">
                                {showPwd ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </IconButton>
                        }
                        variant="soft"
                        color={form.adpwd && !isPwdValid ? 'danger' : 'neutral'}
                    />
                    {form.adpwd && !isPwdValid && (
                        <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>
                            영문자와 숫자를 포함한 8~20자의 비밀번호를 입력하세요.
                        </Typography>
                    )}
                </FormControl>

                {/* ✅ 비밀번호 확인 */}
                <FormControl sx={{ mb: 2 }}>
                    <FormLabel>비밀번호 확인</FormLabel>
                    <Input
                        name="adpwdCheck"
                        type={showPwdCheck ? 'text' : 'password'}
                        placeholder="비밀번호 재입력"
                        value={form.adpwdCheck}
                        onChange={handleChange}
                        startDecorator={<FaLock />}
                        endDecorator={
                            <IconButton variant="plain" onClick={() => setShowPwdCheck(!showPwdCheck)} size="sm">
                                {showPwdCheck ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </IconButton>
                        }
                        variant="soft"
                        color={form.adpwdCheck && !isPwdMatch ? 'danger' : 'neutral'}
                    />
                    {form.adpwdCheck && !isPwdMatch && (
                        <Typography level="body-xs" color="danger" sx={{ mt: 0.5 }}>
                            비밀번호가 일치하지 않습니다.
                        </Typography>
                    )}
                </FormControl>

                {/* ✅ 이름 */}
                <FormControl sx={{ mb: 2 }}>
                    <FormLabel>이름</FormLabel>
                    <Input
                        name="adname"
                        placeholder="이름을 입력하세요"
                        value={form.adname}
                        onChange={handleChange}
                        startDecorator={<FaSignature />}
                        variant="soft"
                    />
                </FormControl>

                {/* ✅ 전화번호 */}
                <FormControl sx={{ mb: 3 }}>
                    <FormLabel>전화번호</FormLabel>
                    <Input
                        name="adphone"
                        placeholder="010-1234-5678"
                        value={form.adphone}
                        onChange={handleChange}
                        startDecorator={<FaPhoneAlt />}
                        variant="soft"
                        color={form.adphone && !isPhoneValid ? 'danger' : 'neutral'}
                    />
                </FormControl>

                {/* ✅ 회원가입 버튼 */}
                <Button
                    fullWidth
                    variant="solid"
                    color="success"
                    onClick={handleSubmit}
                    sx={{ fontWeight: 'bold', bgcolor: '#12b886', '&:hover': { bgcolor: '#0ca678' } }}
                >
                    회원가입
                </Button>

                {/* ✅ 로그인 안내 */}
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography level="body-sm" sx={{ color: '#495057' }}>
                        이미 계정이 있으신가요?{' '}
                        <Link href="/admin/login" sx={{ color: '#087f5b', fontWeight: 'bold' }}>
                            로그인 하러가기
                        </Link>
                    </Typography>
                </Box>
            </Box>

            {/* ✅ Snackbar 알림 */}
            <Snackbar
                open={snackbar.open}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert color={snackbar.color}>{snackbar.message}</Alert>
            </Snackbar>
        </Sheet>
    );
}