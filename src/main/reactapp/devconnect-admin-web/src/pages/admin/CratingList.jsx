// CratingList.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 전용 기업 평가 전체 조회 화면
// - Joy UI 기반 카드 리스트 구성
// - 평가 상세 페이지로 이동 가능
// - 최대 100건 단일 페이지 조회
// - 블랙 & 핑크 테마 통일 적용

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCratingList } from '../../api/cratingApi';          // ✅ API 함수
import AdminLayout from '../../layouts/AdminLayout';           // ✅ 공통 레이아웃
import {
    Typography,
    Grid,
    Card,
    Box,
    Divider,
    Button
} from '@mui/joy';

export default function CratingList() {
    const [list, setList] = useState([]);             // ✅ 평가 목록 상태
    const navigate = useNavigate();                   // ✅ 페이지 이동용 훅

    // ✅ 최초 마운트 시 전체 평가 목록 불러오기
    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await getCratingList(); // 최대 100건 조회
                setList(res.data);
            } catch (err) {
                alert('기업 평가 목록 조회 실패');
                console.error(err);
            }
        };
        fetchList();
    }, []);

    return (
        <div>
            {/* ✅ 상단 타이틀 */}
            <Typography
                level="h3"
                sx={{ mb: 3, color: '#ff4081', fontWeight: 'bold' }}
            >
                📝 기업 평가 목록
            </Typography>

            {/* ✅ 카드 형식 리스트 */}
            <Grid container spacing={2}>
                {list.map((cr) => (
                    <Grid key={cr.crno} xs={12} md={6} lg={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#1e1e1e',
                                color: '#fff',
                                borderColor: '#ff4081',
                                boxShadow: '0 0 10px rgba(255,64,129,0.2)',
                            }}
                        >
                            <Typography level="title-md" sx={{ color: '#ff4081' }}>
                                평가번호: {cr.crno}
                            </Typography>

                            <Divider sx={{ my: 1, borderColor: '#333' }} />

                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>기업번호:</strong> {cr.cno}</p>
                                <p><strong>상태코드:</strong> {cr.crstate}</p>
                            </Box>

                            <Button
                                onClick={() => navigate(`/admin/crating/${cr.crno}`)}
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    borderColor: '#ff4081',
                                    color: '#ff4081',
                                    '&:hover': {
                                        bgcolor: '#ff4081',
                                        color: '#000'
                                    }
                                }}
                            >
                                상세보기
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}
