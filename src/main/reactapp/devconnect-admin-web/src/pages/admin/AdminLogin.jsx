// AdminLogin.jsx | rw 25-05-01
// [설명] Joy UI 기반 관리자 로그인 전체 화면 구성
//        - 좌측 로그인 폼 / 우측 이미지 배경
//        - MUI Joy UI 템플릿 기반 커스터마이징

import * as React from 'react'; // [1] React 기본 모듈 import
import { useNavigate } from 'react-router-dom'; // [2] 페이지 이동용 훅
import { adminLogin } from '../../api/adminApi'; // [3] 로그인 API 요청 함수
import { saveToken } from '../../utils/tokenUtil'; // [4] 토큰 저장 유틸 함수

// [5] Joy UI 컴포넌트 import
import {
    Box,
    Button,
    Typography,
    Input,
    FormControl,
    FormLabel,
    Sheet,
    CssVarsProvider
} from '@mui/joy';

export default function AdminLogin() {
    const [form, setForm] = React.useState({ adid: '', adpwd: '' });
    const navigate = useNavigate();

    // 입력 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // 로그인 요청
    const handleLogin = async () => {
        try {
            const res = await adminLogin(form);
            const token = res.data;
            saveToken(token); // 토큰 저장
            navigate('/admin/dashboard');
        } catch (err) {
            alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
        }
    };

    return (
        <CssVarsProvider>
            <Box sx={{ display: 'flex', height: '100vh', backgroundColor: '#000' }}>
                {/* 좌측 로그인 영역 */}
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sheet
                        variant="outlined"
                        sx={{
                            p: 4,
                            borderRadius: 'md',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            width: 360
                        }}
                    >
                        <Typography level="h4" sx={{ mb: 2, color: '#FF4081' }}>
                            DevConnect 관리자 로그인
                        </Typography>

                        <FormControl sx={{ mb: 2 }}>
                            <FormLabel sx={{ color: '#FF4081' }}>아이디</FormLabel>
                            <Input
                                name="adid"
                                value={form.adid}
                                onChange={handleChange}
                                placeholder="admin ID"
                            />
                        </FormControl>

                        <FormControl sx={{ mb: 2 }}>
                            <FormLabel sx={{ color: '#FF4081' }}>비밀번호</FormLabel>
                            <Input
                                name="adpwd"
                                type="password"
                                value={form.adpwd}
                                onChange={handleChange}
                                placeholder="Password"
                            />
                        </FormControl>

                        <Button variant="outlined" fullWidth sx={{ color: '#FF4081', borderColor: '#FF4081' }} onClick={handleLogin}>
                            로그인
                        </Button>
                    </Sheet>
                </Box>

                {/* 우측 배경 이미지 (선택사항) */}
                <Box sx={{ flex: 1, backgroundImage: 'url(https://source.unsplash.com/random)', backgroundSize: 'cover' }} />
            </Box>
        </CssVarsProvider>
    );
}
