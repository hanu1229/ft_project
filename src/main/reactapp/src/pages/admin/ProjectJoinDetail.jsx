// =======================================================================================
// ProjectJoinDetail.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 프로젝트 신청 상세 페이지
// - 신청 상세 조회 + 상태코드 수정 + 삭제 기능 포함
// - Joy UI 기반 + ChatGPT 스타일 (흰 배경 / 절제된 강조색)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    updateProjectJoin,
    deleteProjectJoin
} from '../../api/projectJoinApi.js';
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
    const { pjno } = useParams();                         // ✅ 신청 번호 (URL에서 추출)
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [pj, setPj] = useState(null);                   // ✅ 신청 상세정보
    const [newType, setNewType] = useState();             // ✅ 상태 변경용
    const [open, setOpen] = useState(false);              // ✅ 삭제 확인 모달 상태

    // =======================================================================================
    // ✅ 상세 조회 API 요청
    // =======================================================================================
    // useEffect(() => {
    //     const fetchDetail = async () => {
    //         try {
    //             const res = await getProjectJoinDetail(pjno, token);
    //             setPj(res.data);
    //             setNewType(res.data.pjtype); // 상태 초기화
    //         } catch (err) {
    //             alert('❗ 신청 상세 조회 실패');
    //             console.error(err);
    //         }
    //     };
    //     fetchDetail();
    // }, [pjno, token]);

    // =======================================================================================
    // ✅ 상태코드 수정 요청
    // =======================================================================================
    const handleUpdate = async () => {
        try {
            const res = await updateProjectJoin(token, {
                ...pj,
                pjtype: newType
            });
            if (res.data) alert('✅ 상태코드 수정 완료');
        } catch (err) {
            alert('❗ 상태 수정 실패');
        }
    };

    // =======================================================================================
    // ✅ 삭제 요청 처리
    // =======================================================================================
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteProjectJoin(pjno, token);
            if (res.data) {
                alert('✅ 신청 삭제 완료');
                navigate('/admin/project-join');
            }
        } catch (err) {
            alert('❗ 삭제 실패');
        } finally {
            setOpen(false);
        }
    };

    if (!pj) return <Typography level="body-md">로딩 중...</Typography>;

    return (
        <div>
            {/* ✅ 제목 */}
            <Typography
                level="h3"
                sx={{ mb: 2, color: '#087f5b', fontWeight: 'bold' }}
            >
                🤝 프로젝트 신청 상세
            </Typography>

            {/* ✅ 신청 정보 카드 */}
            <Card
                variant="soft"
                sx={{
                    p: 3,
                    maxWidth: 480,
                    bgcolor: '#ffffff',
                    border: '1px solid #ced4da',
                    boxShadow: 'sm',
                    color: '#212529',
                }}
            >
                <Typography level="title-md" sx={{ color: '#12b886' }}>
                    신청번호 #{pj.pjno}
                </Typography>

                <Divider sx={{ my: 2, borderColor: '#dee2e6' }} />

                <Box sx={{ fontSize: 14 }}>
                    <p><strong>프로젝트 번호:</strong> {pj.pno}</p>
                    <p><strong>개발자 번호:</strong> {pj.dno}</p>
                    <p><strong>현재 상태코드:</strong> {pj.pjtype}</p>
                </Box>

                {/* ✅ 상태코드 변경 */}
                <Typography level="body-md" sx={{ mt: 2, color: '#495057' }}>
                    상태코드 변경
                </Typography>

                <Select
                    value={newType}
                    onChange={(e, val) => setNewType(val)}
                    sx={{ width: 200, mt: 1 }}
                >
                    <Option value={0}>대기 (0)</Option>
                    <Option value={1}>승인 (1)</Option>
                    <Option value={2}>거절 (2)</Option>
                </Select>

                {/* ✅ 버튼 그룹 */}
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button
                        onClick={handleUpdate}
                        variant="outlined"
                        color="success"
                        sx={{ fontWeight: 'bold' }}
                    >
                        상태 수정
                    </Button>
                    <Button
                        color="danger"
                        onClick={() => setOpen(true)}
                        variant="soft"
                    >
                        삭제
                    </Button>
                </Box>
            </Card>

            {/* ✅ 삭제 확인 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog
                    variant="outlined"
                    role="alertdialog"
                    sx={{ bgcolor: '#fff', color: '#212529' }}
                >
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#e03131' }}>
                        정말 삭제하시겠습니까?
                    </Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 신청 정보는 복구할 수 없습니다.
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