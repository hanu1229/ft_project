// AdminUpdate.jsx | rw 25-05-02 최종 리팩토링
// [설명] 로그인된 관리자 본인의 이름/전화번호 수정 화면
//        - Joy UI 기반 UI + 넷플릭스 테마 적용
//        - 수정 후 /admin/dashboard 이동
//        - FormData 전송 방식 사용

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminInfo, updateAdmin } from '../../api/adminApi';
import { Box, Typography, Input, Button, Stack } from '@mui/joy';
import AdminLayout from '../../layouts/AdminLayout';

export default function AdminUpdate() {
    const [admin, setAdmin] = useState({ adname: '', adphone: '' });
    const navigate = useNavigate();

    // =======================================================================================
    // ✅ 관리자 본인 정보 조회 (마운트 시 1회 실행)
    // =======================================================================================
    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const res = await getAdminInfo();
                setAdmin(res.data);
            } catch (err) {
                console.error('관리자 정보 조회 실패:', err);
                alert('정보를 불러오는 데 실패했습니다.');
            }
        };
        fetchAdminInfo();
    }, []);

    // =======================================================================================
    // ✅ 입력 필드 변경 처리
    // =======================================================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin(prev => ({ ...prev, [name]: value }));
    };

    // =======================================================================================
    // ✅ 수정 요청 핸들러
    // =======================================================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('adname', admin.adname);
        formData.append('adphone', admin.adphone);

        try {
            const res = await updateAdmin(formData);
            if (res.data === true) {
                alert('수정이 완료되었습니다.');
                navigate('/admin/dashboard');
            } else {
                alert('수정 실패: 서버 응답 오류');
            }
        } catch (err) {
            console.error('수정 요청 실패:', err);
            alert('오류가 발생했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div>
            {/* ✅ 페이지 제목 */}
            <Typography
                level="h3"
                sx={{ mb: 3, color: '#ff4081', fontWeight: 'bold' }}
            >
                🛠 관리자 정보 수정
            </Typography>

            {/* ✅ 수정 폼 */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    maxWidth: 400,
                    p: 3,
                    borderRadius: 'lg',
                    backgroundColor: '#1e1e1e',
                    border: '1px solid #ff4081',
                    boxShadow: '0 0 15px rgba(255, 64, 129, 0.2)',
                    color: '#fff'
                }}
            >
                <Stack spacing={2}>
                    {/* 이름 필드 */}
                    <Input
                        name="adname"
                        value={admin.adname}
                        onChange={handleChange}
                        placeholder="이름"
                        required
                        sx={{
                            backgroundColor: '#000',
                            color: '#fff',
                            '&::placeholder': { color: '#aaa' }
                        }}
                    />

                    {/* 전화번호 필드 */}
                    <Input
                        name="adphone"
                        value={admin.adphone}
                        onChange={handleChange}
                        placeholder="전화번호"
                        required
                        sx={{
                            backgroundColor: '#000',
                            color: '#fff',
                            '&::placeholder': { color: '#aaa' }
                        }}
                    />

                    {/* 수정 버튼 */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        sx={{
                            borderColor: '#ff4081',
                            color: '#ff4081',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#ff4081',
                                color: '#000',
                            }
                        }}
                    >
                        수정하기
                    </Button>
                </Stack>
            </Box>
        </div>
    );
}