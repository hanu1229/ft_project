// Header.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 페이지 상단 고정 헤더 컴포넌트
//        - Joy UI 기반 스타일 구성
//        - 좌측 타이틀 / 우측 로그아웃 버튼
//        - 넷플릭스 감성 (블랙 배경 + 핑크 포인트)

import React from 'react';
import { Sheet, Box, Typography, IconButton } from '@mui/joy'; // ✅ Joy UI 컴포넌트
import LogoutIcon from '@mui/icons-material/Logout';            // ✅ 로그아웃 아이콘
import { useNavigate } from 'react-router-dom';                 // ✅ 페이지 이동 훅
import { logoutAdmin } from '../api/adminApi';                  // ✅ 백엔드 로그아웃 API
import { removeToken } from '../utils/tokenUtil';               // ✅ 토큰 제거 유틸리티

export default function Header() {
    const navigate = useNavigate(); // ✅ 페이지 이동 함수

    // =======================================================================================
    // ✅ 로그아웃 처리 함수
    // - 서버 로그아웃 요청 → 클라이언트 토큰 삭제 → 로그인 페이지 리디렉션
    // =======================================================================================
    const handleLogout = async () => {
        try {
            await logoutAdmin();               // (1) 서버 로그아웃 요청
            removeToken();                     // (2) 로컬 토큰 제거
            navigate('/admin/login');          // (3) 로그인 화면으로 이동
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return (
        <Sheet
            variant="solid"
            sx={{
                bgcolor: '#000',                   // [배경] 블랙
                color: '#ff4081',                  // [텍스트] 핑크
                px: 3,
                py: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #ff4081', // [구분선] 핑크 테두리
            }}
        >
            {/* ✅ 좌측: 시스템 타이틀 */}
            <Typography
                level="h4"
                sx={{
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                }}
            >
                DevConnect 관리자 시스템
            </Typography>

            {/* ✅ 우측: 로그아웃 버튼 */}
            <IconButton
                onClick={handleLogout}
                variant="outlined"
                color="danger"
                sx={{
                    borderColor: '#ff4081',
                    color: '#ff4081',
                    '&:hover': {
                        backgroundColor: '#ff4081',
                        color: '#000',
                        borderColor: '#ff4081',
                    },
                }}
            >
                <LogoutIcon />
            </IconButton>
        </Sheet>
    );
}
