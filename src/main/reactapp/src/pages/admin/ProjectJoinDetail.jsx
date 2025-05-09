// =======================================================================================
// ProjectJoinDetail.jsx | rw 25-05-08 최종 리팩토링 (관리자 전용 직권 수정/삭제 전용)
// [설명]
// - 관리자만 접근 가능한 프로젝트 신청 상세 페이지
// - 승인 버튼 없음 (중계자 역할)
// - Joy UI 기반 + StatusBadge 적용
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    updateProjectJoin,
    deleteProjectJoin,
    getProjectJoinByPno
} from '../../api/projectJoinApi.js';
import StatusBadge from '../../components/StatusBadge.jsx';
import {
    Typography,
    Card,
    Box,
    Divider,
    Button,
    Select,
    Option,
    Modal,
    ModalDialog,
    ModalClose
} from '@mui/joy';

export default function ProjectJoinDetail() {
    const { pjno } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [pj, setPj] = useState(null);
    const [newType, setNewType] = useState(null);
    const [open, setOpen] = useState(false);

    // =======================================================================================
    // ✅ 상세 데이터 조회 (전체 목록에서 pjno 매칭으로 추출)
    // =======================================================================================
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProjectJoinByPno(token, 0); // ✅ 전체 신청 목록 조회
                const matched = res.data.find(item => item.pjno === parseInt(pjno));
                if (matched) {
                    setPj(matched);
                    setNewType(matched.pjtype);
                } else {
                    alert('❗ 신청 정보를 찾을 수 없습니다');
                    navigate('/admin/project-join');
                }
            } catch (err) {
                console.error(err);
                alert('❗ 상세 정보 조회 실패');
            }
        };
        fetchData();
    }, [pjno, token, navigate]);

    // =======================================================================================
    // ✅ 상태코드 수정 요청
    // =======================================================================================
    const handleUpdate = async () => {
        try {
            const res = await updateProjectJoin(token, {
                ...pj,
                pjtype: newType
            });
            if (res.data) {
                alert('✅ 상태코드 수정 완료');
                setPj({ ...pj, pjtype: newType });
            }
        } catch (err) {
            alert('❗ 상태코드 수정 실패');
            console.error(err);
        }
    };

    // =======================================================================================
    // ✅ 삭제 요청 처리
    // =======================================================================================
    const handleDelete = async () => {
        try {
            const res = await deleteProjectJoin(token, pjno);
            if (res.data) {
                alert('✅ 신청 삭제 완료');
                navigate('/admin/project-join');
            }
        } catch (err) {
            alert('❗ 삭제 실패');
            console.error(err);
        } finally {
            setOpen(false);
        }
    };

    if (!pj) return <Typography>로딩 중...</Typography>;

    return (
        <Box sx={{ p: 3 }}>
            <Typography level="h3" sx={{ mb: 3, color: '#087f5b', fontWeight: 'bold' }}>
                🤝 프로젝트 신청 상세정보
            </Typography>

            <Card sx={{ maxWidth: 480, p: 3, bgcolor: '#fff', border: '1px solid #dee2e6' }}>
                <Typography level="title-md" sx={{ color: '#12b886' }}>
                    신청번호 #{pj.pjno}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Box sx={{ fontSize: 14 }}>
                    <p><strong>프로젝트 번호:</strong> {pj.pno}</p>
                    <p><strong>개발자 번호:</strong> {pj.dno}</p>
                    <p><strong>현재 상태:</strong> <StatusBadge code={pj.pjtype} type="projectJoin" /></p>
                </Box>

                <Typography level="body-sm" sx={{ mt: 2 }}>상태코드 수정</Typography>
                <Select
                    value={newType}
                    onChange={(e, val) => setNewType(val)}
                    sx={{ mt: 1, width: 200 }}
                >
                    <Option value={0}>대기 (0)</Option>
                    <Option value={1}>승인 (1)</Option>
                    <Option value={2}>거절 (2)</Option>
                </Select>

                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button variant="outlined" color="success" onClick={handleUpdate}>상태 수정</Button>
                    <Button variant="soft" color="danger" onClick={() => setOpen(true)}>삭제</Button>
                </Box>
            </Card>

            {/* ✅ 삭제 확인 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#e03131' }}>정말 삭제하시겠습니까?</Typography>
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