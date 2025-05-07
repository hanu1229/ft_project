// =======================================================================================
// DratingDetail.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 개발자 평가 상세 페이지
// - 평가 조회, 승인, 수정, 삭제 기능 제공
// - Joy UI + ChatGPT 흰 배경 스타일 기반 UI 구성
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getDratingDetail,
    updateDrating,
    deleteDrating
} from '../../api/dratingApi.js';

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

export default function DratingDetail() {
    const { drno } = useParams();                      // ✅ URL에서 drno 추출
    const [dr, setDr] = useState(null);                // ✅ 원본 데이터
    const [form, setForm] = useState({});              // ✅ 수정용 상태
    const [open, setOpen] = useState(false);           // ✅ 삭제 모달 상태
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // =======================================================================================
    // ✅ 상세 평가 조회
    // =======================================================================================
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDratingDetail(drno, token);
                setDr(res.data);
                setForm(res.data);
            } catch (err) {
                alert('개발자 평가 상세 조회 실패');
            }
        };
        fetchDetail();
    }, [drno, token]);

    // =======================================================================================
    // ✅ 입력값 상태 변경 핸들러
    // =======================================================================================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // =======================================================================================
    // ✅ 승인 처리
    // =======================================================================================
    const handleApprove = async () => {
        try {
            const res = await approveDrating(drno, token);
            if (res.data) {
                alert('승인 완료');
                setDr((prev) => ({ ...prev, drstate: 1 }));
            }
        } catch {
            alert('승인 실패');
        }
    };

    // =======================================================================================
    // ✅ 수정 요청 처리
    // =======================================================================================
    const handleUpdate = async () => {
        try {
            const res = await updateDrating(token, form);
            if (res.data) alert('수정 완료');
        } catch {
            alert('수정 실패');
        }
    };

    // =======================================================================================
    // ✅ 삭제 처리
    // =======================================================================================
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteDrating(drno, token);
            if (res.data) {
                alert('삭제 완료');
                navigate('/admin/drating');
            }
        } catch {
            alert('삭제 실패');
        } finally {
            setOpen(false);
        }
    };

    if (!dr) return <p style={{ color: '#888' }}>로딩 중...</p>;

    // =======================================================================================
    // ✅ 렌더링
    // =======================================================================================
    return (
        <Box sx={{ bgcolor: '#ffffff', color: '#212529', px: 3, py: 3 }}>
            <Typography level="h3" sx={{ mb: 3, color: '#12b886', fontWeight: 'bold' }}>
                🧾 개발자 평가 상세
            </Typography>

            <Divider sx={{ mb: 3, borderColor: '#ced4da' }} />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 480,
                    bgcolor: '#f8f9fa',
                    p: 3,
                    borderRadius: 'lg',
                    border: '1px solid #dee2e6',
                }}
            >
                <Input
                    name="drtitle"
                    value={form.drtitle || ''}
                    onChange={handleChange}
                    placeholder="제목"
                    sx={{ bgcolor: '#fff' }}
                />
                <Input
                    name="drcontent"
                    value={form.drcontent || ''}
                    onChange={handleChange}
                    placeholder="내용"
                    sx={{ bgcolor: '#fff' }}
                />
                <Input
                    name="drscore"
                    value={form.drscore || ''}
                    onChange={handleChange}
                    placeholder="점수"
                    type="number"
                    sx={{ bgcolor: '#fff' }}
                />
                <Input
                    name="drstate"
                    value={form.drstate || ''}
                    onChange={handleChange}
                    placeholder="상태코드"
                    sx={{ bgcolor: '#fff' }}
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
                    <Button
                        color="danger"
                        onClick={() => setOpen(true)}
                    >
                        삭제
                    </Button>
                </Box>
            </Box>

            {/* ✅ 삭제 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog" sx={{ bgcolor: '#fff', color: '#212529' }}>
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#fa5252', fontWeight: 'bold' }}>
                        정말 삭제하시겠습니까?
                    </Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 평가는 복구할 수 없습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="plain" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDeleteConfirm}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Box>
    );
}