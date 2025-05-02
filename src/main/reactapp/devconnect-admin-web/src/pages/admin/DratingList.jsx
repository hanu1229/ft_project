// DratingList.jsx | rw 25-05-01
// [설명] 전체 개발자 평가 목록 조회 화면
//        - 평가 번호, 개발자 번호, 상태 표시
//        - 상세 보기 버튼 제공

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDratingList } from '../../api/dratingApi'; // [1] 전체 목록 조회 API
import AdminLayout from '../../layouts/AdminLayout';   // [2] 공통 관리자 레이아웃
import {
    Typography, Grid, Card, Box, Divider, Button      // [3] Joy UI 구성 요소
} from '@mui/joy';

export default function DratingList() {
    const [list, setList] = useState([]);      // [4] 평가 목록 상태
    const navigate = useNavigate();            // [5] 페이지 이동 함수

    // [6] 컴포넌트 마운트 시 평가 목록 조회
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDratingList(); // 전체 조회 요청
                setList(res.data);                 // 응답 데이터를 상태에 저장
            } catch (err) {
                alert('개발자 평가 목록 조회 실패');
            }
        };
        fetchData();
    }, []);

    return (
        <AdminLayout>
            <Typography level="h3" sx={{ mb: 3 }}>개발자 평가 목록</Typography>

            <Grid container spacing={2}>
                {list.map((dr) => (
                    <Grid key={dr.drno} xs={12} md={6} lg={4}>
                        <Card variant="outlined">
                            <Typography level="title-md">평가번호: {dr.drno}</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box>
                                <p><strong>개발자번호:</strong> {dr.dno}</p>
                                <p><strong>상태코드:</strong> {dr.drstate}</p>
                            </Box>
                            <Button onClick={() => navigate(`/admin/drating/${dr.drno}`)}>
                                상세보기
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </AdminLayout>
    );
}