// AdminLayout.jsx | rw 25-05-01
// [설명] 관리자 레이아웃: 좌측 Sidebar + 상단 Header + 관리자 정보 표시 포함

import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Typography, Divider } from '@mui/joy';
import { jwtDecode } from 'jwt-decode'; // ✅ 올바른 import

// ✅ 공통 UI 컴포넌트 (좌측 메뉴 등)
import Sidebar from '../components/Sidebar';
import Header from '../components/Header'; // 선택적 사용

export default function AdminLayout() {
    const [admin, setAdmin] = useState(null); // [1] 관리자 정보 상태

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // ✅ 변수명 일치
                setAdmin({
                    adid: decoded.adid,
                    adname: decoded.adname,
                    role: decoded.role || decoded.adtype,
                });
            } catch (e) {
                console.error('토큰 디코딩 실패', e);
            }
        }
    }, []);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* [2] 좌측 사이드바 */}
            <Sidebar />

            {/* [3] 메인 컨텐츠 영역 */}
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                {/* [4] 상단 관리자 정보 표시 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography level="h4">관리자 페이지</Typography>
                    {admin && (
                        <Typography level="body-sm" color="neutral">
                            👤 {admin.adname} ({admin.adid}) | 권한: {admin.role}
                        </Typography>
                    )}
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* [5] 자식 컴포넌트 영역 */}
                <Outlet />
            </Box>
        </Box>
    );
}