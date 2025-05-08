// =======================================================================================
// ProjectList.jsx | rw 25-05-08 상세 확장 리팩토링 적용
// [설명]
// - Joy UI 카드 기반 프로젝트 목록 페이지
// - 상세보기 클릭 시 버튼 확장 (닫기/삭제/수정/승인)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectList, deleteProject } from '../../api/projectApi.js';
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
    const [projects, setProjects] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState();
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(null); // ✅ 확장 카드 번호
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProjectList();
                setProjects(res.data);
            } catch (err) {
                alert('❗ 프로젝트 목록 조회 실패');
            }
        };
        fetchData();
    }, []);

    const handleDeleteConfirm = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await deleteProject(deleteTarget, token);
            if (res.data) {
                alert('✅ 삭제 완료');
                setProjects((prev) => prev.filter((p) => p.pno !== deleteTarget));
            }
        } catch (err) {
            alert('❗ 삭제 실패');
        } finally {
            setOpen(false);
            setDeleteTarget(null);
        }
    };

    return (
        <div>
            <Typography level="h3" sx={{ mb: 3, color: '#087f5b', fontWeight: 'bold' }}>
                📁 전체 프로젝트 목록
            </Typography>

            <Grid container spacing={2}>
                {projects.map((project) => (
                    <Grid key={project.pno} xs={12} md={6} lg={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#ffffff',
                                borderColor: '#ced4da',
                                color: '#212529',
                                '&:hover': {
                                    boxShadow: '0 0 10px #12b886',
                                    borderColor: '#12b886'
                                }
                            }}
                        >
                            <Typography level="title-md" sx={{ color: '#12b886' }}>
                                {project.pname}
                            </Typography>

                            <Divider sx={{ my: 1, borderColor: '#e9ecef' }} />

                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>번호:</strong> {project.pno}</p>
                                <p><strong>모집 인원:</strong> {project.pcount}</p>
                                <p><strong>시작일:</strong> {project.pstart?.split('T')[0]}</p>
                            </Box>

                            {expanded === project.pno ? (
                                <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                    <Button
                                        color="primary"
                                        onClick={() => setExpanded(null)}
                                    >
                                        닫기
                                    </Button>
                                    <Button
                                        color="danger"
                                        variant="solid"
                                        onClick={() => {
                                            setDeleteTarget(project.pno);
                                            setOpen(true);
                                        }}
                                    >
                                        삭제
                                    </Button>
                                    <Button
                                        sx={{
                                            bgcolor: '#d3f9d8',
                                            color: '#212529',
                                            fontWeight: 'bold',
                                            '&:hover': {
                                                bgcolor: '#b2f2bb'
                                            }
                                        }}
                                        onClick={() => navigate(`/admin/project/${project.pno}`)}
                                    >
                                        수정 / 상세
                                    </Button>
                                    <Button variant="outlined" color="primary">
                                        승인하기
                                    </Button>
                                </Box>
                            ) : (
                                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        onClick={() => setExpanded(project.pno)}
                                        sx={{
                                            borderColor: '#12b886',
                                            color: '#12b886',
                                            '&:hover': { bgcolor: '#12b886', color: '#fff' }
                                        }}
                                    >
                                        상세보기
                                    </Button>
                                    <Button
                                        color="danger"
                                        variant="solid"
                                        onClick={() => {
                                            setDeleteTarget(project.pno);
                                            setOpen(true);
                                        }}
                                    >
                                        삭제
                                    </Button>
                                </Box>
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog" sx={{ bgcolor: '#fff', color: '#212529' }}>
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#c92a2a' }}>정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        이 프로젝트는 삭제 후 복구할 수 없습니다.
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