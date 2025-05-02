// ProjectJoinList.jsx | rw 25-05-01
// [설명] 전체 프로젝트 신청 목록 출력 화면
//        - 관리자(Admin) 전용 화면
//        - 신청번호, 프로젝트번호, 개발자번호, 신청상태 요약 표시
//        - 상세보기 버튼 클릭 시 상세 페이지로 이동

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';               // [1] 페이지 이동용 hook
import { getProjectJoinList } from '../../api/projectJoinApi'; // [2] 신청 전체 목록 조회 API
import AdminLayout from '../../layouts/AdminLayout';          // [3] 좌측 메뉴 포함한 관리자 레이아웃

import {
    Typography, Grid, Card, Box, Divider, Button             // [4] Joy UI 컴포넌트
} from '@mui/joy';

export default function ProjectJoinList() {
    const [list, setList] = useState([]); // [5] 신청 목록 배열 상태
    const navigate = useNavigate();       // [6] 페이지 이동 함수

    // [7] 마운트 시 신청 전체 목록 조회
    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await getProjectJoinList(); // (1) 서버 요청
                setList(res.data);                      // (2) 상태 저장
            } catch (err) {
                alert('신청 목록 조회 실패');           // (3) 예외 처리
            }
        };
        fetchList();
    }, []); // 컴포넌트 최초 렌더링 시 실행

    return (
        <AdminLayout>
            {/* [8] 페이지 제목 */}
            <Typography level="h3" sx={{ mb: 3 }}>전체 프로젝트 신청 목록</Typography>

            {/* [9] 그리드 레이아웃으로 카드형 신청 리스트 출력 */}
            <Grid container spacing={2}>
                {list.map((pj) => (
                    <Grid key={pj.pjno} xs={12} md={6} lg={4}> {/* 반응형 카드 배치 */}
                        <Card variant="outlined">
                            <Typography level="title-md">
                                신청번호: {pj.pjno}
                            </Typography>
                            <Divider sx={{ my: 1 }} />

                            {/* [10] 신청 요약 정보 출력 */}
                            <Box>
                                <p><strong>프로젝트번호:</strong> {pj.pno}</p>
                                <p><strong>개발자번호:</strong> {pj.dno}</p>
                                <p><strong>신청상태:</strong> {pj.pjtype}</p>
                            </Box>

                            {/* [11] 상세페이지 이동 버튼 */}
                            <Button onClick={() => navigate(`/admin/project-join/${pj.pjno}`)}>
                                상세보기
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </AdminLayout>
    );
}