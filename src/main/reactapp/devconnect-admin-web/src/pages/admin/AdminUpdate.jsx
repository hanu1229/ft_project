// =======================================================================================
// AdminUpdate.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 로그인된 관리자 본인 정보 수정 화면
// - Joy UI 기반 + ChatGPT 스타일 (흰 배경, 민트 포인트)
// - FormData 방식 전송
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdminInfo, updateAdmin } from '../../api/adminApi';
import { Box, Typography, Input, Button, Stack } from '@mui/joy';

export default function AdminUpdate() {
    const [admin, setAdmin] = useState({ adname: '', adphone: '' });
    const navigate = useNavigate();

    // =======================================================================================
    // ✅ 관리자 본인 정보 로딩
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
    // ✅ 입력 필드 상태 관리
    // =======================================================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin(prev => ({ ...prev, [name]: value }));
    };

    // =======================================================================================
    // ✅ 관리자 정보 수정 요청
    // =======================================================================================
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('adname', admin.adname);
        formData.append('adphone', admin.adphone);

        try {
            const res = await updateAdmin(formData);
            if (res.data === true) {
                alert('✅ 수정이 완료되었습니다.');
                navigate('/admin/dashboard');
            } else {
                alert('❗ 수정 실패: 서버 오류');
            }
        } catch (err) {
            console.error('수정 요청 실패:', err);
            alert('🚫 오류 발생. 다시 시도해주세요.');
        }
    };

    // =======================================================================================
    // ✅ 렌더링
    // =======================================================================================
    return (
        <Box sx={{ px: 2, py: 3, bgcolor: '#f8f9fa', borderRadius: 'md', maxWidth: 500 }}>
            {/* ✅ 페이지 타이틀 */}
            <Typography level="h3" sx={{ mb: 3, color: '#12b886', fontWeight: 'bold' }}>
                🛠 관리자 정보 수정
            </Typography>

            {/* ✅ 수정 입력 폼 */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    p: 3,
                    borderRadius: 'md',
                    backgroundColor: '#ffffff',
                    border: '1px solid #dee2e6',
                    boxShadow: 'sm',
                }}
            >
                <Stack spacing={2}>
                    {/* 이름 입력 */}
                    <Input
                        name="adname"
                        value={admin.adname}
                        onChange={handleChange}
                        placeholder="이름"
                        required
                        variant="soft"
                    />

                    {/* 전화번호 입력 */}
                    <Input
                        name="adphone"
                        value={admin.adphone}
                        onChange={handleChange}
                        placeholder="전화번호"
                        required
                        variant="soft"
                    />

                    {/* 수정 버튼 */}
                    <Button
                        type="submit"
                        fullWidth
                        variant="solid"
                        color="success"
                        sx={{
                            fontWeight: 'bold',
                            bgcolor: '#12b886',
                            '&:hover': {
                                bgcolor: '#0ca678'
                            }
                        }}
                    >
                        수정하기
                    </Button>
                </Stack>
            </Box>
        </Box>
    );
}