// =======================================================================================
// DratingList.jsx | rw 25-05-10 최종 리팩토링
// [설명] 관리자 전용 개발자 평가 목록 + 상세 이동
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDratingList } from '../../api/dratingApi.js';
import {
    Typography, Grid, Card, Box, Divider, Button
} from '@mui/joy';

export default function DratingList() {
    const [list, setList] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getDratingList(token, { page: 1, size: 100 });
                setList(res.data.content || []);
            } catch {
                alert('목록 조회 실패');
            }
        };
        fetch();
    }, []);

    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#fff' }}>
            <Typography level="h3" sx={{ mb: 3, fontWeight: 'bold', color: '#12b886' }}>
                🧾 개발자 평가 목록
            </Typography>

            <Grid container spacing={2}>
                {list.map((dr) => (
                    <Grid key={dr.drno} xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ bgcolor: '#f8f9fa', p: 2 }}>
                            <Typography level="title-md" sx={{ fontWeight: 'bold', color: '#12b886' }}>
                                평가번호: {dr.drno}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>개발자번호:</strong> {dr.dno}</p>
                                <p><strong>점수:</strong> {dr.drscore}</p>
                                <p><strong>상태:</strong> {dr.drstate}</p>
                            </Box>
                            <Button
                                onClick={() => navigate(`/admin/drating/${dr.drno}`)}
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    borderColor: '#12b886',
                                    color: '#12b886',
                                    fontWeight: 'bold',
                                    '&:hover': { bgcolor: '#12b886', color: '#fff' }
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