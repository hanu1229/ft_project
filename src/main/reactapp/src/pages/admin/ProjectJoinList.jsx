// =======================================================================================
// ProjectJoinList.jsx | rw 25-05-11 관리자 전용 API 기반 리팩토링
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllProjectJoins } from '../../api/projectJoinApi';
import { Typography, Grid, Card, Box, Divider, Button } from '@mui/joy';

export default function ProjectJoinList() {
    const [list, setList] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getAllProjectJoins(token);
                setList(res.data || []);
            } catch {
                alert('프로젝트참여 목록 조회 실패');
            }
        };
        fetch();
    }, [token]);

    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#fff' }}>
            <Typography level="h3" sx={{ mb: 3, fontWeight: 'bold', color: '#12b886' }}>
                🤝 프로젝트 참여 목록
            </Typography>

            <Grid container spacing={2}>
                {list.map((pj) => (
                    <Grid key={pj.pjno} xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ bgcolor: '#f8f9fa', p: 2 }}>
                            <Typography level="title-md" sx={{ fontWeight: 'bold', color: '#12b886' }}>
                                참여번호: {pj.pjno}
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>프로젝트번호:</strong> {pj.pno}</p>
                                <p><strong>개발자번호:</strong> {pj.dno}</p>
                            </Box>
                            <Button
                                onClick={() => navigate(`/admin/project-join/${pj.pjno}`)}
                                variant="outlined"
                                sx={{ mt: 2, borderColor: '#12b886', color: '#12b886' }}
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