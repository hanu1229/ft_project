// =======================================================================================
// ProjectJoinList.jsx | rw 25-05-08 리팩토링
// [설명]
// - 관리자 전용 프로젝트 신청 목록 페이지
// - 관리자는 승인 없이 단순 확인 및 직권 수정/삭제만 가능함
// - 승인 버튼 제거, 상태뱃지 표시, 상세/삭제 버튼 유지
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProjectJoinPaging, deleteProjectJoin } from '../../api/projectJoinApi.js';
import StatusBadge from '../../components/StatusBadge.jsx'; // ✅ 상태 뱃지 컴포넌트
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
    const [list, setList] = useState([]);                       // ✅ 신청 목록 상태
    const [expanded, setExpanded] = useState(null);            // ✅ 카드 펼침 여부 상태
    const [deleteTarget, setDeleteTarget] = useState(null);    // ✅ 삭제 대상 번호
    const [open, setOpen] = useState(false);                   // ✅ 삭제 모달 상태
    const navigate = useNavigate();

    // =======================================================================================
    // ✅ 신청 목록 조회 API 호출
    // =======================================================================================
    useEffect(() => {
        const fetchList = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getProjectJoinPaging(token, { page: 0, size: 100 });
                setList(res.data.content || []);
            } catch (err) {
                alert('❗ 프로젝트 신청 목록 조회 실패');
                console.error(err);
            }
        };
        fetchList();
    }, []);

    // =======================================================================================
    // ✅ 카드 펼침/닫기 토글 함수
    // =======================================================================================
    const toggleExpand = (pjno) => {
        setExpanded((prev) => (prev === pjno ? null : pjno));
    };

    // =======================================================================================
    // ✅ 삭제 요청 함수
    // =======================================================================================
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await deleteProjectJoin(token, deleteTarget);
            if (res.data) {
                setList((prev) => prev.filter(pj => pj.pjno !== deleteTarget));
                setDeleteTarget(null);
                setOpen(false);
            }
        } catch (err) {
            alert('❗ 삭제 실패');
            console.error(err);
        }
    };

    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#ffffff' }}>
            {/* ✅ 제목 */}
            <Typography level="h3" sx={{ mb: 3, color: '#087f5b', fontWeight: 'bold' }}>
                🤝 프로젝트 신청 목록
            </Typography>

            {/* ✅ 신청 카드 리스트 */}
            <Grid container spacing={2}>
                {list.map((pj) => (
                    <Grid key={pj.pjno} xs={12} md={6} lg={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#f8f9fa',
                                borderColor: '#12b886',
                                '&:hover': {
                                    boxShadow: '0 0 12px rgba(18, 184, 134, 0.3)'
                                }
                            }}
                        >
                            <Typography level="title-md" sx={{ color: '#12b886' }}>
                                신청번호: {pj.pjno}
                            </Typography>
                            <Divider sx={{ my: 1, borderColor: '#ced4da' }} />
                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>프로젝트번호:</strong> {pj.pno}</p>
                                <p><strong>개발자번호:</strong> {pj.dno}</p>
                                <p><strong>상태:</strong> <StatusBadge code={pj.pjtype} type="projectJoin" /></p>
                            </Box>

                            {/* ✅ 버튼 그룹 - 승인 버튼 제거 */}
                            {expanded === pj.pjno ? (
                                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    <Button color="neutral" onClick={() => toggleExpand(null)}>닫기</Button>
                                    <Button color="danger" variant="solid" onClick={() => { setDeleteTarget(pj.pjno); setOpen(true); }}>삭제</Button>
                                    <Button color="success" onClick={() => navigate(`/admin/project-join/${pj.pjno}`)}>수정 / 상세</Button>
                                </Box>
                            ) : (
                                <Box sx={{ mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        size="sm"
                                        onClick={() => toggleExpand(pj.pjno)}
                                        sx={{
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
                                </Box>
                            )}
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
                        삭제된 신청 정보는 복구할 수 없습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="soft" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDelete}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Box>
    );
}
