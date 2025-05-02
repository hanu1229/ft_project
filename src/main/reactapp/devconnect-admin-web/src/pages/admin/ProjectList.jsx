// ProjectList.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자용 전체 프로젝트 목록 페이지
//        - 카드형 출력 / 삭제 기능 포함
//        - Joy UI + 넷플릭스 스타일 테마 적용

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectList, deleteProject } from '../../api/projectApi';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Typography,
    Grid,
    Card,
    Box,
    Divider,
    Button,
    Modal,
    ModalDialog,
    ModalClose
} from '@mui/joy';

export default function ProjectList() {
    // ✅ 상태값 정의
    const [projects, setProjects] = useState([]);          // 전체 프로젝트 목록
    const [deleteTarget, setDeleteTarget] = useState(null); // 삭제 대상 프로젝트 번호
    const [open, setOpen] = useState(false);               // 삭제 확인 모달 상태
    const navigate = useNavigate();                        // 페이지 이동용

    // ✅ 최초 로딩 시 전체 프로젝트 조회
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProjectList();
                setProjects(res.data);
            } catch (err) {
                alert('프로젝트 목록 조회 실패');
            }
        };
        fetchData();
    }, []);

    // ✅ 삭제 처리 함수
    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await deleteProject(deleteTarget, token);
            if (res.data) {
                alert('삭제 완료');
                setProjects(projects.filter(p => p.pno !== deleteTarget));
            }
        } catch (err) {
            alert('삭제 실패');
        } finally {
            setOpen(false);
            setDeleteTarget(null);
        }
    };

    return (
        <div>
            {/* ✅ 제목 */}
            <Typography level="h3" sx={{ mb: 3, color: '#FF4081', fontWeight: 'bold' }}>
                📁 전체 프로젝트 목록
            </Typography>

            {/* ✅ 프로젝트 목록 */}
            <Grid container spacing={2}>
                {projects.map((project) => (
                    <Grid key={project.pno} xs={12} md={6} lg={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#1a1a1a',
                                color: '#fff',
                                borderColor: '#ff4081',
                                '&:hover': { boxShadow: '0 0 12px #ff4081' }
                            }}
                        >
                            {/* 프로젝트 이름 */}
                            <Typography level="title-md" sx={{ color: '#FF4081' }}>
                                {project.pname}
                            </Typography>
                            <Divider sx={{ my: 1, borderColor: '#333' }} />

                            {/* 정보 요약 */}
                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>프로젝트번호:</strong> {project.pno}</p>
                                <p><strong>모집 인원:</strong> {project.pcount}</p>
                                <p><strong>시작일:</strong> {project.pstart?.split('T')[0]}</p>
                            </Box>

                            {/* 버튼 */}
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`/admin/project/${project.pno}`)}
                                    sx={{
                                        borderColor: '#ff4081',
                                        color: '#ff4081',
                                        '&:hover': {
                                            bgcolor: '#ff4081',
                                            color: '#000',
                                        }
                                    }}
                                >
                                    상세보기
                                </Button>
                                <Button
                                    variant="soft"
                                    color="danger"
                                    onClick={() => {
                                        setDeleteTarget(project.pno);
                                        setOpen(true);
                                    }}
                                >
                                    삭제
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ✅ 삭제 확인 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog" sx={{ bgcolor: '#1e1e1e', color: '#fff' }}>
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#ff4081' }}>정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 프로젝트는 복구할 수 없습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="soft" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDeleteConfirm}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </div>
    );
}
