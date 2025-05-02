// DratingDetail.jsx | rw 25-05-01
// [설명] 개발자 평가 상세 조회 + 승인, 수정, 삭제 기능 포함

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getDratingDetail, approveDrating, updateDrating, deleteDrating
} from '../../api/dratingApi';                      // [1] 관련 API 요청
import AdminLayout from '../../layouts/AdminLayout'; // [2] 공통 관리자 레이아웃
import {
    Typography, Box, Input, Button, Divider, Modal,
    ModalDialog, ModalClose
} from '@mui/joy';

export default function DratingDetail() {
    const { drno } = useParams();                 // [3] URL에서 평가 번호 추출
    const [dr, setDr] = useState(null);           // [4] 평가 데이터
    const [form, setForm] = useState({});         // [5] 수정용 상태
    const [open, setOpen] = useState(false);      // [6] 삭제 확인 모달 상태
    const navigate = useNavigate();
    const token = localStorage.getItem('token');  // [7] 토큰 추출

    // [8] 상세 조회
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDratingDetail(drno, token);
                setDr(res.data);
                setForm(res.data);
            } catch (err) {
                alert('상세 조회 실패');
            }
        };
        fetchDetail();
    }, [drno, token]);

    // [9] 입력값 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // [10] 평가 승인 처리
    const handleApprove = async () => {
        try {
            const res = await approveDrating(drno, token);
            if (res.data) {
                alert('승인 완료');
                setDr({ ...dr, drstate: 1 }); // 승인 상태 반영
            }
        } catch (err) {
            alert('승인 실패');
        }
    };

    // [11] 평가 수정 요청
    const handleUpdate = async () => {
        try {
            const res = await updateDrating(token, form);
            if (res.data) alert('수정 완료');
        } catch (err) {
            alert('수정 실패');
        }
    };

    // [12] 삭제 최종 요청
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteDrating(drno, token);
            if (res.data) {
                alert('삭제 완료');
                navigate('/admin/drating');
            }
        } catch (err) {
            alert('삭제 실패');
        } finally {
            setOpen(false);
        }
    };

    if (!dr) return <p>로딩 중...</p>;

    return (
        <AdminLayout>
            <Typography level="h3">개발자 평가 상세</Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input name="drtitle" value={form.drtitle || ''} onChange={handleChange} placeholder="제목" />
                <Input name="drcontent" value={form.drcontent || ''} onChange={handleChange} placeholder="내용" />
                <Input name="drscore" value={form.drscore || ''} onChange={handleChange} placeholder="점수" />
                <Input name="drstate" value={form.drstate || ''} onChange={handleChange} placeholder="상태코드" />

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