// =======================================================================================
// Forbidden.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 외 접근 시 진입 제한 화면 (403 Forbidden)
// - RoleRoute 보호 라우팅에서 권한 부족 시 자동 진입
// - ChatGPT 스타일 기반: 흰 배경 + 절제된 컬러 + 라운드 버튼 구성
// =======================================================================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/joy';

export default function Forbidden() {
    const navigate = useNavigate(); // ✅ 라우팅 함수

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                bgcolor: '#ffffff',            // ✅ 흰 배경 (ChatGPT 스타일)
                color: '#222',                 // ✅ 기본 텍스트 컬러
                textAlign: 'center',
                px: 3,
            }}
        >
            {/* ✅ 상태 코드 */}
            <Typography
                level="h1"
                sx={{
                    mb: 2,
                    fontSize: 96,
                    fontWeight: 'bold',
                    color: '#fa5252',          // 붉은 경고 포인트
                }}
            >
                403
            </Typography>

            {/* ✅ 접근 제한 메시지 */}
            <Typography level="h3" sx={{ mb: 2 }}>
                🚫 접근이 거부되었습니다
            </Typography>

            <Typography
                level="body-md"
                sx={{
                    mb: 4,
                    maxWidth: 480,
                    color: '#495057',
                }}
            >
                이 페이지는 <strong style={{ color: '#fa5252' }}>관리자(Admin)</strong> 권한을 가진 사용자만 접근할 수 있습니다. <br />
                로그인된 계정의 권한을 확인해 주세요.
            </Typography>

            {/* ✅ 대시보드 복귀 버튼 */}
            <Button
                variant="solid"
                color="danger"
                size="lg"
                sx={{
                    px: 4,
                    borderRadius: 'xl',
                    fontWeight: 'bold',
                    bgcolor: '#ff6b6b',
                    '&:hover': {
                        bgcolor: '#fa5252',
                    },
                }}
                onClick={() => navigate('/admin/dashboard')}
            >
                대시보드로 돌아가기
            </Button>
        </Box>
    );
}