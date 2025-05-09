// =======================================================================================
// DratingList.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 개발자 평가 목록 화면
// - 평가 상세페이지 이동 버튼 포함
// - Joy UI + ChatGPT 흰 배경 테마 구성
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDratingList } from '../../api/dratingApi.js'; // ✅ 평가 전체 조회 API
import {
    Typography,
    Grid,
    Card,
    Box,
    Divider,
    Button
} from '@mui/joy';

export default function DratingList() {
    const [list, setList] = useState([]);              // ✅ 평가 리스트 상태
    const navigate = useNavigate();                    // ✅ 라우팅 이동 함수

    // =======================================================================================
    // ✅ useEffect - 최초 마운트 시 전체 평가 목록 요청
    // =======================================================================================
    useEffect(() => {
        const fetchList = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getDratingList(token, { page: 1, size: 100 });    // (1) API 요청
                console.log(res.data)
                setList(res.data['content']);                     // (2) 상태 저장
            } catch (err) {
                alert('개발자 평가 목록 조회 실패');
                console.error(err);
            }
        };
        fetchList();
    }, []);

    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#ffffff', color: '#212529' }}>
            {/* ✅ 페이지 타이틀 */}
            <Typography
                level="h3"
                sx={{ mb: 3, color: '#12b886', fontWeight: 'bold' }}
            >
                🧾 개발자 평가 목록
            </Typography>

            {/* ✅ 카드 레이아웃 */}
            <Grid container spacing={2}>
                {list.map((dr) => (
                    <Grid key={dr.drno} xs={12} md={6} lg={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#f8f9fa',
                                color: '#212529',
                                borderColor: '#12b886',
                                '&:hover': {
                                    boxShadow: '0 0 12px rgba(18, 184, 134, 0.3)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            {/* ✅ 평가 정보 */}
                            <Typography level="title-md" sx={{ color: '#12b886' }}>
                                평가번호: {dr.drno}
                            </Typography>

                            <Divider sx={{ my: 1, borderColor: '#ced4da' }} />

                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>개발자번호:</strong> {dr.dno}</p>
                                <p><strong>상태코드:</strong> {dr.drstate}</p>
                            </Box>

                            {/* ✅ 상세보기 버튼 */}
                            <Button
                                size="sm"
                                variant="outlined"
                                onClick={() => navigate(`/admin/drating/${dr.drno}`)}
                                sx={{
                                    mt: 1,
                                    borderColor: '#12b886',
                                    color: '#12b886',
                                    '&:hover': {
                                        bgcolor: '#12b886',
                                        color: '#fff'
                                    }
                                }}
                            >
                                상세보기
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}