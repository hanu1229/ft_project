// =======================================================================================
// CratingList.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 기업 평가 전체 목록 조회 화면
// - Joy UI 기반 카드 리스트 구성
// - 흰 배경 + 절제된 민트/핑크 컬러 기반의 ChatGPT.com 스타일 적용
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCratingList } from '../../api/cratingApi';
import {
    Typography,
    Grid,
    Card,
    Box,
    Divider,
    Button
} from '@mui/joy';

export default function CratingList() {
    const [list, setList] = useState([]);         // ✅ 기업 평가 목록 상태
    const navigate = useNavigate();               // ✅ 페이지 이동

    // =======================================================================================
    // ✅ 최초 마운트 시 전체 평가 데이터 조회 (최대 100건)
    // =======================================================================================
    useEffect(() => {
        (async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getCratingList(token, { page: 1, size: 100 });
                setList(res.data.content || []);
            } catch (err) {
                console.error('기업 평가 목록 조회 실패', err);
                alert('기업 평가 목록 조회 실패');
            }
        })();
    }, []);

    // =======================================================================================
    // ✅ 평가 카드 UI 렌더링
    // =======================================================================================
    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#fff', color: '#212529' }}>
            {/* ✅ 타이틀 */}
            <Typography
                level="h3"
                sx={{ mb: 3, color: '#12b886', fontWeight: 'bold' }}
            >
                📝 기업 평가 목록
            </Typography>

            {/* ✅ 카드 리스트 */}
            <Grid container spacing={2}>
                {list.map((cr) => (
                    <Grid key={cr.crno} xs={12} sm={6} md={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#f8f9fa',
                                border: '1px solid #ced4da',
                                color: '#212529',
                                p: 2,
                                borderRadius: 'md',
                                boxShadow: 'sm',
                                '&:hover': {
                                    boxShadow: '0 0 0 2px #12b88633'
                                }
                            }}
                        >
                            <Typography level="title-md" sx={{ color: '#12b886', fontWeight: 600 }}>
                                📋 평가번호: {cr.crno}
                            </Typography>

                            <Divider sx={{ my: 1, borderColor: '#dee2e6' }} />

                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>기업번호:</strong> {cr.cno}</p>
                                <p><strong>상태코드:</strong> {cr.crstate}</p>
                                <p><strong>점수:</strong> {cr.crscore}</p>
                            </Box>

                            <Button
                                onClick={() => navigate(`/admin/crating/${cr.crno}`)}
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    borderColor: '#12b886',
                                    color: '#12b886',
                                    fontWeight: 'bold',
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