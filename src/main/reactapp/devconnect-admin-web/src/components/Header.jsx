// =======================================================================================
// Header.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 페이지 공통 상단 헤더 컴포넌트
// - ChatGPT 스타일: 흰 배경 + 회색 테두리 + 연녹색 포인트
// - JWT 토큰 기반 로그아웃 기능 포함
// =======================================================================================

import React from 'react';
import { Sheet, Box, Typography, IconButton } from '@mui/joy';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../api/adminApi';
import { removeToken } from '../utils/tokenUtil';

export default function Header() {
    const navigate = useNavigate();

    // ✅ 로그아웃 처리 함수
    const handleLogout = async () => {
        try {
            await logoutAdmin();        // 서버 로그아웃
            removeToken();              // 토큰 삭제
            navigate('/admin/login');   // 로그인 페이지 이동
        } catch (err) {
            console.error('로그아웃 실패:', err);
        }
    };

    return (
        <Sheet
            variant="plain"
            sx={{
                px: 3,
                py: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                bgcolor: '#ffffff',                   // ✅ 흰 배경
                borderBottom: '1px solid #e0e0e0',    // ✅ 얇은 회색 테두리
                boxShadow: 'sm',
                position: 'sticky',
                top: 0,
                zIndex: 1000,
            }}
        >
            {/* ✅ 좌측 로고/타이틀 */}
            <Typography
                level="title-lg"
                sx={{
                    fontWeight: 'bold',
                    color: '#222',
                    letterSpacing: 0.5,
                }}
            >
                DevConnect Admin
            </Typography>

            {/* ✅ 우측 로그아웃 버튼 */}
            <Box>
                <IconButton
                    onClick={handleLogout}
                    variant="outlined"
                    color="neutral"
                    sx={{
                        borderColor: '#ccc',
                        color: '#666',
                        '&:hover': {
                            bgcolor: '#12b886',        // ✅ 포인트: 연녹색
                            borderColor: '#12b886',
                            color: '#ffffff',
                        },
                    }}
                >
                    <LogoutIcon />
                </IconButton>
            </Box>
        </Sheet>
    );
}