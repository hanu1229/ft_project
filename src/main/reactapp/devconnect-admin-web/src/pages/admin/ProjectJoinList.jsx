// ProjectJoinList.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 전용 프로젝트 신청 전체 조회 화면
//        - Joy UI 기반 카드 레이아웃
//        - 넷플릭스 테마 적용 (블랙 배경 + 핫핑크 포인트)
//        - 신청번호, 프로젝트번호, 개발자번호, 상태코드 표시
//        - 상세 페이지로 이동 기능 포함

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectJoinList } from '../../api/projectJoinApi';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Typography,
    Grid,
    Card,
    Box,
    Divider,
    Button
} from '@mui/joy';

export default function ProjectJoinList() {
    const [list, setList] = useState([]);              // ✅ 전체 신청 목록 상태
    const navigate = useNavigate();                    // ✅ 페이지 이동용 함수

    // ✅ 최초 마운트 시 신청 목록 불러오기
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProjectJoinList(); // API 요청
                setList(res.data);                      // 응답 데이터 상태 반영
            } catch (err) {
                alert('프로젝트 신청 목록 조회 실패');
            }
        };
        fetchData();
    }, []);

    return (
        <div>
            {/* ✅ 페이지 제목 */}
            <Typography
                level="h3"
                sx={{ mb: 3, color: '#FF4081', fontWeight: 'bold' }}
            >
                🤝 프로젝트 신청 목록
            </Typography>

            {/* ✅ 신청 목록 카드 출력 */}
            <Grid container spacing={2}>
                {list.map((pj) => (
                    <Grid key={pj.pjno} xs={12} md={6} lg={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#1a1a1a',
                                color: '#fff',
                                borderColor: '#FF4081',
                                '&:hover': {
                                    boxShadow: '0 0 10px #FF4081'
                                }
                            }}
                        >
                            {/* ✅ 신청번호 */}
                            <Typography level="title-md" sx={{ color: '#FF4081' }}>
                                신청번호: {pj.pjno}
                            </Typography>

                            <Divider sx={{ my: 1, borderColor: '#333' }} />

                            {/* ✅ 신청 정보 출력 */}
                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>프로젝트번호:</strong> {pj.pno}</p>
                                <p><strong>개발자번호:</strong> {pj.dno}</p>
                                <p><strong>상태코드:</strong> {pj.pjtype}</p>
                            </Box>

                            {/* ✅ 상세보기 버튼 */}
                            <Button
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    borderColor: '#FF4081',
                                    color: '#FF4081',
                                    '&:hover': {
                                        bgcolor: '#FF4081',
                                        color: '#000'
                                    }
                                }}
                                onClick={() => navigate(`/admin/project-join/${pj.pjno}`)}
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