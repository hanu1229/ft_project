// =======================================================================================
// ProjectJoinList.jsx | rw 25-05-03 v2 수정
// [설명]
// - 관리자 전용 프로젝트 신청 전체 조회 화면
// - 신청번호, 프로젝트번호, 개발자번호, 상태코드 표시
// - getProjectJoinList(token, pno) 연동 완료
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectJoinList } from '../../api/projectJoinApi';
import {
    Typography,
    Grid,
    Card,
    Box,
    Divider,
    Button
} from '@mui/joy';

export default function ProjectJoinList() {
    const [list, setList] = useState([]);        // ✅ 신청 목록 상태
    const [pno] = useState(1);                   // ✅ 테스트용 프로젝트 번호 (임시 고정값)
    const navigate = useNavigate();             // ✅ 페이지 이동

    // =======================================================================================
    // ✅ 최초 마운트 시 전체 신청 목록 조회
    // =======================================================================================
    useEffect(() => {
        const fetchList = async () => {
            try {
                const token = localStorage.getItem('token');  // ✅ 토큰 조회
                const res = await getProjectJoinList(token, pno);
                setList(res.data);
            } catch (err) {
                alert('❗ 프로젝트 신청 목록 조회 실패');
                console.error(err);
            }
        };
        fetchList();
    }, [pno]);

    return (
        <div>
            {/* ✅ 제목 */}
            <Typography level="h3" sx={{ mb: 3, color: '#087f5b', fontWeight: 'bold' }}>
                🤝 프로젝트 신청 목록 (pno: {pno})
            </Typography>

            {/* ✅ 카드 리스트 출력 */}
            <Grid container spacing={2}>
                {list.map((pj) => (
                    <Grid key={pj.pjno} xs={12} md={6} lg={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#ffffff',
                                borderColor: '#ced4da',
                                boxShadow: 'sm',
                                '&:hover': {
                                    boxShadow: '0 0 8px #12b886',
                                    borderColor: '#12b886'
                                },
                            }}
                        >
                            {/* ✅ 신청번호 */}
                            <Typography level="title-md" sx={{ color: '#12b886' }}>
                                신청번호: {pj.pjno}
                            </Typography>

                            <Divider sx={{ my: 1, borderColor: '#e0e0e0' }} />

                            {/* ✅ 정보 영역 */}
                            <Box sx={{ fontSize: 14, color: '#495057' }}>
                                <p><strong>프로젝트번호:</strong> {pj.pno}</p>
                                <p><strong>개발자번호:</strong> {pj.dno}</p>
                                <p><strong>상태코드:</strong> {pj.pjtype}</p>
                            </Box>

                            {/* ✅ 상세 이동 버튼 */}
                            <Button
                                variant="outlined"
                                size="sm"
                                onClick={() => navigate(`/admin/project-join/${pj.pjno}`)}
                                sx={{
                                    mt: 2,
                                    borderColor: '#12b886',
                                    color: '#12b886',
                                    fontWeight: 500,
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
        </div>
    );
}