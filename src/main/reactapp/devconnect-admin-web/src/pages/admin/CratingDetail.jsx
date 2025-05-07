// CratingDetail.jsx | rw 25-05-02 (최종 리팩토링)
// [설명]
// - 관리자 전용 기업 평가 상세 조회/수정/승인/삭제 기능
// - ChatGPT.com 스타일 기반 흰 배경 + 절제된 컬러 구성
// - Joy UI 기반 구성 및 토큰 인증 처리

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getCratingDetail,
    updateCrating,
    deleteCrating
} from '../../api/cratingApi';
import {
    Typography,
    Box,
    Input,
    Button,
    Divider,
    Modal,
    ModalDialog,
    ModalClose
} from '@mui/joy';

export default function CratingDetail() {
    const { crno } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [form, setForm] = useState(null);     // ✅ 평가 정보 (수정 포함)
    const [open, setOpen] = useState(false);    // ✅ 삭제 모달

    // =======================================================================================
    // ✅ 평가 상세 조회
    // =======================================================================================
    useEffect(() => {
        (async () => {
            try {
                const res = await getCratingDetail(token, crno);
                setForm(res.data);
            } catch {
                alert('기업 평가 상세 조회 실패');
            }
        })();
    }, [crno, token]);

    // =======================================================================================
    // ✅ 입력 핸들러
    // =======================================================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // =======================================================================================
    // ✅ 수정 요청
    // =======================================================================================
    const handleUpdate = async () => {
        try {
            const res = await updateCrating(token, form);
            if (res.data) alert('수정 완료');
        } catch {
            alert('수정 실패');
        }
    };

    // =======================================================================================
    // ✅ 승인 요청
    // =======================================================================================
    // const handleApprove = async () => {
    //     try {
    //         const res = await approveCrating(crno, token);
    //         if (res.data) {
    //             alert('승인 완료');
    //             setForm((prev) => ({ ...prev, crstate: 1 }));
    //         }
    //     } catch {
    //         alert('승인 실패');
    //     }
    // };

    // =======================================================================================
    // ✅ 삭제 요청
    // =======================================================================================
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteCrating(crno, token);
            if (res.data) {
                alert('삭제 완료');
                navigate('/admin/crating');
            }
        } catch {
            alert('삭제 실패');
        } finally {
            setOpen(false);
        }
    };

    // =======================================================================================
    // ✅ 로딩 처리
    // =======================================================================================
    if (!form) return <Typography>로딩 중...</Typography>;

    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#fff', color: '#212529' }}>
            {/* ✅ 타이틀 */}
            <Typography level="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#12b886' }}>
                📝 기업 평가 상세
            </Typography>

            <Divider sx={{ mb: 3, borderColor: '#dee2e6' }} />

            {/* ✅ 입력 폼 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 480,
                    bgcolor: '#f8f9fa',
                    p: 3,
                    borderRadius: 'md',
                    border: '1px solid #ced4da',
                    boxShadow: 'sm'
                }}
            >
                <Input
                    name="crtitle"
                    value={form.crtitle || ''}
                    onChange={handleChange}
                    placeholder="제목"
                    variant="soft"
                />
                <Input
                    name="crcontent"
                    value={form.crcontent || ''}
                    onChange={handleChange}
                    placeholder="내용"
                    variant="soft"
                />
                <Input
                    name="crscore"
                    type="number"
                    value={form.crscore || ''}
                    onChange={handleChange}
                    placeholder="점수 (0~100)"
                    variant="soft"
                />
                <Input
                    name="crstate"
                    value={form.crstate || ''}
                    onChange={handleChange}
                    placeholder="상태코드"
                    variant="soft"
                />

                {/* ✅ 버튼 그룹 */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                        onClick={handleUpdate}
                        variant="outlined"
                        sx={{
                            borderColor: '#12b886',
                            color: '#12b886',
                            '&:hover': { bgcolor: '#12b886', color: '#fff' }
                        }}
                    >
                        수정
                    </Button>
                    <Button
                        onClick={handleApprove}
                        variant="outlined"
                        sx={{
                            borderColor: '#228be6',
                            color: '#228be6',
                            '&:hover': { bgcolor: '#228be6', color: '#fff' }
                        }}
                    >
                        승인
                    </Button>
                    <Button color="danger" onClick={() => setOpen(true)}>
                        삭제
                    </Button>
                </Box>
            </Box>

            {/* ✅ 삭제 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" sx={{ bgcolor: '#fff', color: '#000' }}>
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#d9480f' }}>
                        정말 삭제하시겠습니까?
                    </Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        이 평가는 복구할 수 없습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="soft" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDeleteConfirm}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Box>
    );
}