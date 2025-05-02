// Sidebar.jsx | rw 25-05-01
// [설명] 관리자 페이지용 좌측 사이드 메뉴

import React from 'react';
import { Box, List, ListItem, ListItemButton, ListItemDecorator, Typography } from '@mui/joy';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUsers, FaBuilding, FaCode, FaStar, FaFolderOpen, FaClipboardList } from 'react-icons/fa';

export default function Sidebar() {
    const navigate = useNavigate();

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
        <Box sx={{ width: 220, backgroundColor: '#111', color: '#FF4081', p: 2 }}>
            <Typography level="h5" sx={{ mb: 3, textAlign: 'center' }}>
                DevConnect
            </Typography>
            <List>
                {menu.map((item, idx) => (
                    <ListItem key={idx}>
                        <ListItemButton onClick={() => navigate(item.path)}>
                            <ListItemDecorator>{item.icon}</ListItemDecorator>
                            {item.label}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
