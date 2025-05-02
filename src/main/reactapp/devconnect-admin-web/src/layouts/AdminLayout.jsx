// AdminLayout.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 전체 페이지 레이아웃
//        - 좌측 사이드바 + 우측 상단 헤더 + 메인 컨텐츠 구성
//        - JWT 토큰 기반 로그인 관리자 정보 추출 및 출력
//        - Joy UI + 넷플릭스 스타일 (블랙/핑크) 테마 적용

import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/joy';
import { jwtDecode } from 'jwt-decode';

// ✅ 공통 UI 컴포넌트
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function AdminLayout() {
    const [admin, setAdmin] = useState(null); // ✅ 로그인 관리자 정보 상태

    // =======================================================================================
    // ✅ 마운트 시 JWT 토큰 디코딩하여 관리자 정보 추출
    // =======================================================================================
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAdmin({
                    adid: decoded.adid,
                    adname: decoded.adname,
                    role: decoded.role || decoded.adtype,
                });
            } catch (e) {
                console.error('토큰 디코딩 실패:', e);
            }
        }
    }, []);

    return (
        <Box
            sx={{
                display: 'flex',
                minHeight: '100vh',
                bgcolor: '#121212',  // 전체 다크 배경
                color: '#ffffff',
            }}
        >
            {/* ✅ [1] 좌측 고정 사이드바 */}
            <Sidebar />

            {/* ✅ [2] 우측 콘텐츠 영역 */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    bgcolor: '#121212',
                    color: '#ffffff',
                }}
            >
                {/* ✅ [3] 상단 관리자 정보 영역 */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography
                        level="h4"
                        sx={{
                            color: '#ff4081',
                            fontWeight: 'bold',
                        }}
                    >
                        관리자 페이지
                    </Typography>

                    {admin && (
                        <Typography level="body-sm" sx={{ color: '#f8bbd0' }}>
                            👤 {admin.adname} ({admin.adid}) | 권한: {admin.role}
                        </Typography>
                    )}
                </Box>

                {/* ✅ [4] 섹션 구분선 */}
                <Divider sx={{ mb: 2, borderColor: '#ff4081' }} />

                {/* ✅ [5] 하위 컴포넌트 출력 */}
                <Outlet />
            </Box>
        </Box>
    );
}