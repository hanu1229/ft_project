// Sidebar.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 전용 사이드바 메뉴 컴포넌트
//        - 좌측 고정형 사이드바 레이아웃
//        - Joy UI + react-icons 기반 구성
//        - 블랙 배경 + 핑크 포인트 테마 적용
//        - 메뉴 클릭 시 useNavigate로 라우팅 처리

import React from 'react';
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemDecorator,
    Typography
} from '@mui/joy';
import { useNavigate } from 'react-router-dom';

// ✅ 메뉴 아이콘 (FontAwesome 기반)
import {
    FaTachometerAlt,   // 대시보드
    FaUsers,           // 관리자 목록
    FaBuilding,        // 기업 관리
    FaCode,            // 개발자 관리
    FaStar,            // 평가 (공통 아이콘)
    FaFolderOpen,      // 프로젝트
    FaClipboardList    // 프로젝트 참여 신청
} from 'react-icons/fa';

export default function Sidebar() {
    const navigate = useNavigate(); // ✅ 페이지 이동 함수

    // =======================================================================================
    // ✅ 사이드바 메뉴 항목 정의
    // - label: 메뉴 이름
    // - icon: 메뉴 아이콘
    // - path: 이동할 라우팅 경로
    // =======================================================================================
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
                width: 220,                       // [고정 너비]
                bgcolor: '#111',                  // [배경] 블랙
                color: '#FF4081',                 // [텍스트] 핑크
                p: 2,
                minHeight: '100vh',
                borderRight: '1px solid #ff4081'  // [테두리] 핑크 라인
            }}
        >
            {/* ✅ 상단 브랜드 타이틀 */}
            <Typography
                level="h5"
                sx={{
                    mb: 3,
                    textAlign: 'center',
                    color: '#FF4081',
                    fontWeight: 'bold',
                    letterSpacing: 1
                }}
            >
                DevConnect
            </Typography>

            {/* ✅ 사이드 메뉴 리스트 */}
            <List sx={{ gap: 1 }}>
                {menu.map((item, idx) => (
                    <ListItem key={idx} disablePadding>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            sx={{
                                color: '#fff',
                                borderRadius: '8px',
                                '&:hover': {
                                    bgcolor: '#ff4081',
                                    color: '#000',
                                },
                            }}
                        >
                            <ListItemDecorator sx={{ color: '#ff4081' }}>
                                {item.icon}
                            </ListItemDecorator>
                            {item.label}
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}