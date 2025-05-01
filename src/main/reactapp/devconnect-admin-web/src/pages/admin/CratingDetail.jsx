// CratingDetail.jsx | rw 25-05-01
// [설명] 기업 평가 상세 조회 + 수정, 승인, 삭제 기능 포함

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getCratingDetail, approveCrating,
    updateCrating, deleteCrating
} from '../../api/cratingApi';                      // [1] API 요청 함수
import AdminLayout from '../../layouts/AdminLayout'; // [2] 관리자 레이아웃
import {
    Typography, Box, Input, Button, Divider,
    Modal, ModalDialog, ModalClose
} from '@mui/joy';

export default function CratingDetail() {
    const { crno } = useParams();                   // [3] URL 파라미터에서 평가 번호 추출
    const [cr, setCr] = useState(null);             // [4] 상세 평가 정보 원본
    const [form, setForm] = useState({});           // [5] 수정용 상태 객체
    const [open, setOpen] = useState(false);        // [6] 삭제 모달 상태
    const navigate = useNavigate();
    const token = localStorage.getItem('token');    // [7] 인증 토큰

    // [8] 상세 조회 API 요청
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getCratingDetail(crno, token);
                setCr(res.data);
                setForm(res.data);
            } catch (err) {
                alert('상세 조회 실패');
            }
        };
        fetchDetail();
    }, [crno, token]);

    // [9] 입력값 변경 처리
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // [10] 승인 처리 API 호출
    const handleApprove = async () => {
        try {
            const res = await approveCrating(crno, token);
            if (res.data) {
                alert('승인 완료');
                setCr({ ...cr, crstate: 1 }); // 상태코드 반영
            }
        } catch (err) {
            alert('승인 실패');
        }
    };

    // [11] 수정 API 요청
    const handleUpdate = async () => {
        try {
            const res = await updateCrating(token, form);
            if (res.data) alert('수정 완료');
        } catch (err) {
            alert('수정 실패');
        }
    };

    // [12] 삭제 확정
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteCrating(crno, token);
            if (res.data) {
                alert('삭제 완료');
                navigate('/admin/crating');
            }
        } catch (err) {
            alert('삭제 실패');
        } finally {
            setOpen(false);
        }
    };

    if (!cr) return <p>로딩 중...</p>;

    return (
        <AdminLayout>
            <Typography level="h3">기업 평가 상세</Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input name="crtitle" value={form.crtitle || ''} onChange={handleChange} placeholder="제목" />
                <Input name="crcontent" value={form.crcontent || ''} onChange={handleChange} placeholder="내용" />
                <Input name="crscore" value={form.crscore || ''} onChange={handleChange} placeholder="점수" />
                <Input name="crstate" value={form.crstate || ''} onChange={handleChange} placeholder="상태코드" />

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={handleUpdate}>수정</Button>
                    <Button onClick={handleApprove}>승인</Button>
                    <Button color="danger" onClick={() => setOpen(true)}>삭제</Button>
                </Box>
            </Box>

            {/* ✅ 삭제 확인 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <ModalClose />
                    <Typography level="h4">정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 평가는 복구할 수 없습니다.
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