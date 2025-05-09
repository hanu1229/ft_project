// =======================================================================================
// ProjectJoinList.jsx | rw 25-05-09 최종 리팩토링
// [설명]
// - 관리자 전용 프로젝트 신청 목록 전체 조회 페이지
// - 카드형 출력 + 삭제 기능 포함
// - Joy UI + ChatGPT 스타일 흰 배경 + 연두색 포인트 UI 적용
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectJoinList, deleteProjectJoin } from '../../api/projectJoinApi.js';
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

export default function ProjectJoinList() {
    const [projectJoins, setProjectJoins] = useState([]);        // ✅ 신청 목록
    const [deleteTarget, setDeleteTarget] = useState();           // ✅ 삭제 대상 번호
    const [open, setOpen] = useState(false);                      // ✅ 모달 오픈 여부
    const navigate = useNavigate();


    // =======================================================================================
    // ✅ 신청 전체 목록 불러오기 (최초 마운트 시 실행)
    // =======================================================================================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProjectJoinList();
                setProjectJoins(res.data);
            } catch (err) {
                alert('❗ 프로젝트 신청 목록 조회 실패');
                console.error(err);
            }
        };
        fetchData();
    }, []);

    // =======================================================================================
    // ✅ 삭제 요청 처리
    // =======================================================================================
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteProjectJoin(deleteTarget, token);
            if (res.data) {
                alert('✅ 삭제 완료');
                setProjectJoins(prev => prev.filter(pj => pj.pjno !== deleteTarget));
            }
        } catch (err) {
            alert('❗ 삭제 실패');
            console.error(err);
        } finally {
            setOpen(false);
            setDeleteTarget(null);
        }
    };

    return (
        <div>
            {/* ✅ 타이틀 */}
            <Typography level="h3" sx={{ mb: 3, color: '#087f5b', fontWeight: 'bold' }}>
                🤝 전체 프로젝트 신청 목록
            </Typography>

            {/* ✅ 카드형 목록 출력 */}
            <Grid container spacing={2}>
                {projectJoins.map((pj) => (
                    <Grid key={pj.pjno} xs={12} md={6} lg={4}>
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
                                신청번호: {pj.pjno}
                            </Typography>

                            <Divider sx={{ my: 1, borderColor: '#e9ecef' }} />

                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>프로젝트번호:</strong> {pj.pno}</p>
                                <p><strong>개발자번호:</strong> {pj.dno}</p>
                                <p><strong>상태코드:</strong> {pj.pjtype}</p>
                            </Box>

                            {/* 버튼 그룹 */}
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => navigate(`/admin/project-join/${pj.pjno}`)}
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
                                        setDeleteTarget(pj.pjno);
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
                        이 신청 정보는 삭제 후 복구할 수 없습니다.
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