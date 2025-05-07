// =======================================================================================
// AdminLayout.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 전체 레이아웃 컴포넌트
// - 좌측 Sidebar + 상단 Header + 관리자 JWT 정보 표시
// - Joy UI + ChatGPT 스타일 기반: 절제된 흰 배경 UI + 그린 포인트 적용
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/joy';
import { jwtDecode } from 'jwt-decode';

// ✅ 공통 컴포넌트
import Sidebar from '../components/Sidebar.jsx'; // 좌측 메뉴바
import Header from '../components/Header.jsx';   // 상단 헤더

export default function AdminLayout() {
    const [admin, setAdmin] = useState(null); // ✅ 로그인한 관리자 정보 저장

    // =======================================================================================
    // ✅ 마운트 시: JWT 토큰 디코딩 → 관리자 정보 추출
    // =======================================================================================
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAdmin({
                    adid: decoded.adid,
                    adname: decoded.adname,
                    role: decoded.role ?? decoded.adtype,
                });
            } catch (e) {
                console.error('JWT 디코딩 실패:', e);
            }
        }
    }, []);

    // =======================================================================================
    // ✅ 전체 레이아웃 렌더링
    // =======================================================================================
    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                bgcolor: '#ffffff', // ✅ 흰 배경 (ChatGPT 느낌)
                color: '#222',      // ✅ 기본 텍스트 색상
            }}
        >
            {/* ✅ [1] 좌측 사이드바 고정 */}
            <Sidebar />

            {/* ✅ [2] 우측 콘텐츠 메인 영역 */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    bgcolor: '#ffffff',
                    px: 3,
                    py: 2,
                }}
            >
                {/* ✅ [3] 상단 고정 헤더 */}
                <Header />

                {/* ✅ [4] 관리자 정보 표시 영역 */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mt: 2,
                        mb: 1,
                    }}
                >
                    <Typography level="h4" sx={{ fontWeight: 'bold', color: '#12b886' }}>
                        관리자 페이지
                    </Typography>

                    {admin && (
                        <Typography level="body-sm" sx={{ color: '#666' }}>
                            👤 {admin.adname} ({admin.adid}) &nbsp;|&nbsp; 권한: {admin.role}
                        </Typography>
                    )}
                </Box>

                {/* ✅ [5] 섹션 구분선 */}
                <Divider sx={{ borderColor: '#e0e0e0', mb: 2 }} />

                {/* ✅ [6] 자식 페이지 출력 영역 */}
                <Outlet />
            </Box>
        </Box>
    );
}