// AdminLogin.jsx | rw 25-04-30
// [설명] Joy UI 기반 관리자 로그인 전체 페이지 구성
//        - 좌측: 로그인 폼 (아이디/비밀번호 입력 + 토큰 저장)
//        - 우측: 이미지 백그라운드 영역
//        - MUI Joy UI 템플릿 기반 커스터마이징 (https://mui.com/joy-ui/ 참고)

import * as React from 'react';                             // [1] React 기본 모듈 import
import { useNavigate } from 'react-router-dom';             // [2] 페이지 이동 훅
import { adminLogin } from '../api/adminApi';               // [3] 서버 로그인 API 요청 함수
import { saveToken } from '../utils/tokenUtil';             // [4] JWT 토큰 localStorage 저장

// [5] MUI Joy UI 컴포넌트 import (디자인 템플릿용)
import {
    Box, Button, Typography, Input, FormControl, FormLabel,
    Sheet, CssVarsProvider, Divider, Link, Checkbox,
    Stack, Grid
} from '@mui/joy';

export default function AdminLogin() {
    // [A] 로그인에 필요한 상태값 (양방향 바인딩)
    const [adid, setAdid] = React.useState('');               // 입력된 아이디
    const [adpwd, setAdpwd] = React.useState('');             // 입력된 비밀번호
    const navigate = useNavigate();                           // 페이지 이동 객체

    // =======================================================================================
    // [1] 로그인 버튼 클릭 시 처리 함수
    const handleLogin = async () => {
        try {
            const res = await adminLogin({ adid, adpwd });        // 서버에 로그인 요청 (POST)
            saveToken(res.data);                                  // JWT 토큰을 localStorage 저장
            alert('로그인 성공');
            navigate('/admin/dashboard');                         // 대시보드 페이지로 이동
        } catch (err) {
            console.error(err);                                   // 디버깅용 로그
            alert('로그인 실패: ' + (err.response?.data?.message || err.message || '서버 오류'));
        }
    };

    // =======================================================================================
    // [2] 전체 페이지 구성 (좌측 로그인 폼 + 우측 배경 이미지)
    return (
        <CssVarsProvider>
            <Grid container sx={{ minHeight: '100vh' }}> {/* 화면 전체 높이 설정 */}

                {/* [좌측] 로그인 폼 영역 (md 6 = 전체 12 중 6칸 차지) */}
                <Grid xs={12} md={6} sx={{
                    display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <Sheet
                        variant="outlined"
                        sx={{
                            width: 400,
                            mx: 'auto',
                            my: 4,
                            py: 3,
                            px: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                            borderRadius: 'sm',
                            boxShadow: 'md'
                        }}
                    >
                        {/* [1] 로그인 상단 타이틀 영역 */}
                        <Typography level="h4">회사 로고</Typography>
                        <Typography level="h5">로그인</Typography>
                        <Typography level="body2">
                            회사에 처음 오셨나요? <Link href="#">가입하세요!</Link>
                        </Typography>

                        {/* [2] 구글 로그인 (디자인용 버튼) */}
                        <Button fullWidth>Google로 계속하기</Button>
                        <Divider>또는</Divider>

                        {/* [3] 아이디 입력창 */}
                        <FormControl>
                            <FormLabel>아이디</FormLabel>
                            <Input
                                name="adid"
                                value={adid}
                                onChange={(e) => setAdid(e.target.value)}
                                placeholder="아이디 입력"
                            />
                        </FormControl>

                        {/* [4] 비밀번호 입력창 */}
                        <FormControl>
                            <FormLabel>비밀번호</FormLabel>
                            <Input
                                type="password"
                                name="adpwd"
                                value={adpwd}
                                onChange={(e) => setAdpwd(e.target.value)}
                                placeholder="비밀번호 입력"
                            />
                        </FormControl>

                        {/* [5] 체크박스 + 비밀번호 찾기 링크 */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Checkbox label="나를 기억해" />
                            <Link href="#" level="body2">비밀번호를 잊으셨나요?</Link>
                        </Stack>

                        {/* [6] 로그인 버튼 */}
                        <Button onClick={handleLogin}>로그인</Button>

                        {/* [7] 하단 푸터 텍스트 */}
                        <Typography level="body3" textAlign="center" sx={{ mt: 3 }}>ⓒ 귀사 2025</Typography>
                    </Sheet>
                </Grid>

                {/* [우측] 배경 이미지 영역 (반응형: md 이상일 때만 보임) */}
                <Grid xs={false} md={6} sx={{
                    backgroundImage: 'url("/bg-login.png")',  // 실제 배경 이미지 경로로 교체 필요
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }} />
            </Grid>
        </CssVarsProvider>
    );
}