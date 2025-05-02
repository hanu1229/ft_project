// Forbidden.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 외 접근 시 표시되는 403 금지 화면
//        - RoleRoute 보호 라우팅에서 권한 없는 경우 진입
//        - Joy UI + 넷플릭스 감성 테마 반영

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/joy';

export default function Forbidden() {
    const navigate = useNavigate(); // ✅ 페이지 이동 핸들러

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#121212',
                color: '#FF4081',
                textAlign: 'center',
                px: 3,
            }}
        >
            {/* ✅ 에러 코드 */}
            <Typography
                level="h1"
                sx={{ mb: 2, fontSize: 96, fontWeight: 'bold', color: '#ff4081' }}
            >
                403
            </Typography>

            {/* ✅ 메시지 */}
            <Typography level="h3" sx={{ mb: 2 }}>
                🚫 접근이 거부되었습니다
            </Typography>

            <Typography level="body-md" sx={{ mb: 4, maxWidth: 480, color: '#f8bbd0' }}>
                이 페이지는 <strong>관리자(Admin)</strong> 권한을 가진 사용자만 접근할 수 있습니다. <br />
                로그인된 계정의 권한을 확인해 주세요.
            </Typography>

            {/* ✅ 복귀 버튼 */}
            <Button
                variant="solid"
                color="danger"
                size="lg"
                sx={{
                    px: 4,
                    fontWeight: 'bold',
                    bgcolor: '#ff4081',
                    '&:hover': {
                        bgcolor: '#e91e63',
                    },
                }}
                onClick={() => navigate('/admin/dashboard')}
            >
                대시보드로 돌아가기
            </Button>
        </Box>
    );
}