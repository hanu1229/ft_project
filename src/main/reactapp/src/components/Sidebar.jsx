// =======================================================================================
// Sidebar.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 사이드바 메뉴
// - ChatGPT.com 느낌의 흰 배경 + 절제된 포인트 컬러
// - 메뉴 클릭 시 useNavigate로 페이지 이동
// =======================================================================================

import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemDecorator,
    Typography,
} from '@mui/joy';
import { useNavigate, useLocation } from 'react-router-dom';

// ✅ 아이콘 구성 (FontAwesome 기반)
import {
    FaTachometerAlt,
    FaUsers,
    FaBuilding,
    FaCode,
    FaStar,
    FaFolderOpen,
    FaClipboardList,
} from 'react-icons/fa';

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    // ✅ 메뉴 목록 정의
    const menu = [
        { label: '대시보드', icon: <FaTachometerAlt />, path: '/admin/dashboard' },
        { label: '관리자 목록', icon: <FaUsers />, path: '/admin/list' },
        { label: '기업 관리', icon: <FaBuilding />, path: '/admin/company' },
        { label: '개발자 관리', icon: <FaCode />, path: '/admin/developer' },
        { label: '기업 평가', icon: <FaStar />, path: '/admin/crating' },
        { label: '개발자 평가', icon: <FaStar />, path: '/admin/drating' },
        { label: '프로젝트', icon: <FaFolderOpen />, path: '/admin/project' },
        { label: '참여 신청', icon: <FaClipboardList />, path: '/admin/project-join' },
    ];

    return (
        <Box
            sx={{
                minWidth: 240,
                bgcolor: '#ffffff', // ✅ 흰 배경
                color: '#333',
                py: 3,
                px: 2,
                minHeight: '100vh',
                borderRight: '1px solid #e0e0e0', // ✅ 연한 회색 테두리
            }}
        >
            {/* ✅ 상단 로고/브랜드 */}
            <Typography
                level="h4"
                sx={{
                    mb: 4,
                    textAlign: 'center',
                    color: '#12b886', // ✅ 녹색 포인트
                    fontWeight: 'bold',
                    fontSize: '20px',
                }}
            >
                DevConnect
            </Typography>

            {/* ✅ 메뉴 목록 렌더링 */}
            <List sx={{ gap: 0.5 }}>
                {menu.map((item, idx) => {
                    const isActive = location.pathname.startsWith(item.path);
                    return (
                        <ListItem key={idx}>
                            <ListItemButton
                                onClick={() => navigate(item.path)}
                                selected={isActive}
                                sx={{
                                    borderRadius: '8px',
                                    px: 2,
                                    py: 1.2,
                                    bgcolor: isActive ? '#f1f3f5' : 'transparent', // ✅ 선택 시 배경
                                    '&:hover': {
                                        bgcolor: '#f8f9fa',
                                    },
                                    color: isActive ? '#12b886' : '#555',
                                }}
                            >
                                <ListItemDecorator sx={{ color: isActive ? '#12b886' : '#aaa' }}>
                                    {item.icon}
                                </ListItemDecorator>
                                {item.label}
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>
        </Box>
    );
}