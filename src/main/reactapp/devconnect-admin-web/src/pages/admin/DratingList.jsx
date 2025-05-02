// DratingList.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 전용 개발자 평가 목록 화면
//        - Joy UI 기반 카드 레이아웃
//        - 상세 페이지 이동 버튼 포함
//        - 블랙 & 핑크 넷플릭스 테마 적용

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDratingList } from '../../api/dratingApi'; // [1] API 함수
import AdminLayout from '../../layouts/AdminLayout'; // [2] 공통 레이아웃
import {
    Typography,
    Grid,
    Card,
    Box,
    Divider,
    Button,
} from '@mui/joy';

export default function DratingList() {
    const [list, setList] = useState([]);      // [3] 평가 목록 상태
    const navigate = useNavigate();            // [4] 페이지 이동 함수

    // ✅ [5] 데이터 불러오기
    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await getDratingList();
                setList(res.data);
            } catch (err) {
                alert('개발자 평가 목록 조회 실패');
            }
        };
        fetchList();
    }, []);

    return (
        <div>
            {/* ✅ 타이틀 */}
            <Typography
                level="h3"
                sx={{ mb: 3, color: '#ff4081', fontWeight: 'bold' }}
            >
                🧾 개발자 평가 목록
            </Typography>

            {/* ✅ 평가 카드 목록 */}
            <Grid container spacing={2}>
                {list.map((dr) => (
                    <Grid key={dr.drno} xs={12} md={6} lg={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#1e1e1e',
                                color: '#fff',
                                borderColor: '#ff4081',
                                '&:hover': {
                                    boxShadow: '0 0 10px #ff4081',
                                },
                            }}
                        >
                            <Typography level="title-md" sx={{ color: '#ff4081' }}>
                                평가번호: {dr.drno}
                            </Typography>

                            <Divider sx={{ my: 1, borderColor: '#ff4081' }} />

                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>개발자번호:</strong> {dr.dno}</p>
                                <p><strong>상태코드:</strong> {dr.drstate}</p>
                            </Box>

                            {/* ✅ 상세보기 버튼 */}
                            <Button
                                size="sm"
                                variant="outlined"
                                sx={{
                                    mt: 1,
                                    borderColor: '#ff4081',
                                    color: '#ff4081',
                                    '&:hover': { bgcolor: '#ff4081', color: '#000' },
                                }}
                                onClick={() => navigate(`/admin/drating/${dr.drno}`)}
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
