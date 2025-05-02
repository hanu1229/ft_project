// ProjectList.jsx | rw 25-05-01
// [설명] 전체 프로젝트 목록 조회 및 삭제 기능 포함
//        - 각 프로젝트 카드 형태로 출력
//        - 리스트에서 바로 삭제 가능 (승인 완료된 데이터이므로 실수 위험 낮음)
//        - 삭제 시 확인 모달 적용

import React, { useEffect, useState } from 'react';
import { getProjectList, deleteProject } from '../../api/projectApi'; // [1] API 요청 함수
import AdminLayout from '../../layouts/AdminLayout';                  // [2] 공통 관리자 레이아웃
import { useNavigate } from 'react-router-dom';                       // [3] 페이지 이동용 hook

import {
    Card, Typography, Box, Grid, Divider, Button,                   // [4] Joy UI 기본 UI 요소
    Modal, ModalDialog, ModalClose                                  // [5] 삭제 확인 모달 구성용
} from '@mui/joy';

export default function ProjectList() {
    const [projects, setProjects] = useState([]);           // [6] 프로젝트 목록 상태
    const [deleteTarget, setDeleteTarget] = useState(null); // [7] 삭제할 프로젝트 번호 저장용
    const [open, setOpen] = useState(false);                // [8] 모달 열림 여부 상태
    const navigate = useNavigate();                         // [9] 페이지 이동 함수

    // [10] 마운트 시 전체 프로젝트 목록 불러오기
    useEffect(() => {
        const fetchData = async () => {
            const res = await getProjectList(); // (1) API 호출
            setProjects(res.data);              // (2) 상태 저장
        };
        fetchData();
    }, []);

    // [11] 삭제 확정 처리
    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem('token'); // (1) 토큰 추출
        const res = await deleteProject(deleteTarget, token); // (2) 삭제 요청
        if (res.data) {
            alert('삭제 완료');
            // (3) 삭제된 항목을 목록에서 제거
            setProjects(projects.filter(p => p.pno !== deleteTarget));
        }
        setOpen(false); // 모달 닫기
        setDeleteTarget(null); // 상태 초기화
    };

    return (
        <AdminLayout>
            {/* [12] 페이지 제목 */}
            <Typography level="h3" sx={{ mb: 3 }}>전체 프로젝트 목록</Typography>

            {/* [13] 카드형 프로젝트 리스트 */}
            <Grid container spacing={2}>
                {projects.map((project) => (
                    <Grid key={project.pno} xs={12} md={6} lg={4}>
                        <Card variant="outlined">
                            <Typography level="title-md">{project.pname}</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box>
                                <p><strong>프로젝트번호:</strong> {project.pno}</p>
                                <p><strong>모집 인원:</strong> {project.pcount}</p>
                                <p><strong>시작일:</strong> {project.pstart?.split('T')[0]}</p>
                            </Box>

                            {/* [14] 상세 보기 이동 */}
                            <Button onClick={() => navigate(`/admin/project/${project.pno}`)}>
                                상세
                            </Button>

                            {/* [15] 삭제 버튼 클릭 시 모달 오픈 */}
                            <Button
                                color="danger"
                                onClick={() => {
                                    setDeleteTarget(project.pno); // 삭제 대상 설정
                                    setOpen(true);               // 모달 열기
                                }}
                            >
                                삭제
                            </Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* [16] 삭제 확인용 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <ModalClose />
                    <Typography level="h4">정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        이 프로젝트는 삭제 후 복구할 수 없습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="soft" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDeleteConfirm}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </AdminLayout>
    );
}