// Forbidden.jsx | rw 25-05-01
// [설명] 관리자 외 사용자 접근 차단 시 표시되는 403 Forbidden 화면
//        - RoleRoute에서 관리자 권한이 아닐 경우 이동

import React from 'react';
import { Box, Typography, Button } from '@mui/joy';
import { useNavigate } from 'react-router-dom';

export default function Forbidden() {
    const navigate = useNavigate();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#111',
                color: '#FF4081',
                textAlign: 'center',
                px: 3,
            }}
        >
            <Typography level="h1" sx={{ mb: 2, fontSize: 72 }}>
                403
            </Typography>
            <Typography level="h3" sx={{ mb: 3 }}>
                접근이 거부되었습니다
            </Typography>
            <Typography level="body-md" sx={{ mb: 4 }}>
                관리자만 접근 가능한 페이지입니다. 로그인 상태 또는 권한을 확인해주세요.
            </Typography>
            <Button variant="solid" color="primary" onClick={() => navigate('/admin/dashboard')}>
                대시보드로 돌아가기
            </Button>
        </Box>
    );
}