// Header.jsx | rw 25-05-01
// [설명] 관리자 전용 상단 헤더 컴포넌트 (Joy UI 기반)

import React from 'react';
import { Sheet, Box, Typography, IconButton } from '@mui/joy';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '../api/adminApi';
import { removeToken } from '../utils/tokenUtil';

export default function Header() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutAdmin();
            removeToken();
            navigate('/admin/login');
        } catch (error) {
            console.error('로그아웃 실패:', error);
        }
    };

    return (
        <Sheet
            variant="solid"
            color="neutral"
            sx={{
                bgcolor: 'black',
                color: 'hotpink',
                px: 3,
                py: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}
        >
            <Typography level="h4" sx={{ fontWeight: 'bold' }}>
                DevConnect 관리자 시스템
            </Typography>
            <IconButton onClick={handleLogout} variant="outlined" color="danger">
                <LogoutIcon />
            </IconButton>
        </Sheet>
    );
}