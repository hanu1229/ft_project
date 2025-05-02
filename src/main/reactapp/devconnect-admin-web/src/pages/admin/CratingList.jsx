// CratingList.jsx | rw 25-05-01
// [설명] 기업 평가 목록 전체 조회 화면
//        - 페이징 없이 일괄 조회 (기본 100건)
//        - 상세 페이지로 이동 가능

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCratingList } from '../../api/cratingApi'; // [1] 기업 평가 전체 조회 API
import AdminLayout from '../../layouts/AdminLayout';   // [2] 공통 관리자 레이아웃
import {
    Typography, Grid, Card, Box, Divider, Button      // [3] Joy UI 컴포넌트
} from '@mui/joy';

export default function CratingList() {
    const [list, setList] = useState([]);              // [4] 평가 목록 상태
    const navigate = useNavigate();                    // [5] 상세 페이지 이동용

    // [6] 기업 평가 전체 조회 요청
    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await getCratingList();    // 기본 page=1, size=100
                setList(res.data);
            } catch (err) {
                alert('기업 평가 목록 조회 실패');
            }
        };
        fetchList();
    }, []);

    return (
        <AdminLayout>
            <Typography level="h3" sx={{ mb: 3 }}>기업 평가 목록</Typography>
            <Grid container spacing={2}>
                {list.map((cr) => (
                    <Grid key={cr.crno} xs={12} md={6} lg={4}>
                        <Card variant="outlined">
                            <Typography level="title-md">평가번호: {cr.crno}</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box>
                                <p><strong>기업번호:</strong> {cr.cno}</p>
                                <p><strong>상태코드:</strong> {cr.crstate}</p>
                            </Box>
                            <Button onClick={() => navigate(`/admin/crating/${cr.crno}`)}>
                                상세보기
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </AdminLayout>
    );
}