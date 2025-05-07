// =======================================================================================
// ProjectList.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 프로젝트 목록 전체 조회 페이지
// - 카드형 출력 + 삭제 기능 포함
// - Joy UI + ChatGPT 스타일 흰 배경 + 연두색 포인트 UI 적용
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectList, deleteProject } from '../../api/projectApi';
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
    const [projects, setProjects] = useState([]);         // ✅ 프로젝트 목록
    const [deleteTarget, setDeleteTarget] = useState();   // ✅ 삭제 대상 번호
    const [open, setOpen] = useState(false);              // ✅ 모달 오픈 여부
    const navigate = useNavigate();

    // =======================================================================================
    // ✅ 프로젝트 전체 목록 불러오기 (최초 마운트 시 실행)
    // =======================================================================================
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

    // =======================================================================================
    // ✅ 삭제 요청 처리
    // =======================================================================================
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
            {/* ✅ 타이틀 */}
            <Typography level="h3" sx={{ mb: 3, color: '#087f5b', fontWeight: 'bold' }}>
                📁 전체 프로젝트 목록
            </Typography>

            {/* ✅ 카드형 프로젝트 목록 출력 */}
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
                            {/* 제목 */}
                            <Typography level="title-md" sx={{ color: '#12b886' }}>
                                {project.pname}
                            </Typography>

                            {/* 구분선 */}
                            <Divider sx={{ my: 1, borderColor: '#e9ecef' }} />

                            {/* 상세 정보 */}
                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>번호:</strong> {project.pno}</p>
                                <p><strong>모집 인원:</strong> {project.pcount}</p>
                                <p><strong>시작일:</strong> {project.pstart?.split('T')[0]}</p>
                            </Box>

                            {/* 버튼 그룹 */}
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`/admin/project/${project.pno}`)}
                                    sx={{
                                        borderColor: '#12b886',
                                        color: '#12b886',
                                        '&:hover': { bgcolor: '#12b886', color: '#fff' }
                                    }}
                                >
                                    상세보기
                                </Button>
                                <Button
                                    variant="outlined"
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