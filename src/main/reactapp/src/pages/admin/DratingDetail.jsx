// =======================================================================================
// DratingDetail.jsx | rw 25-05-11 최종 안정화 (관리자 전용 개발자 평가 상세/수정/삭제)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDratingDetail, updateDrating, deleteDrating } from '../../api/dratingApi';
import {
    Typography, Box, Input, Button, Divider,
    Modal, ModalDialog, ModalClose
} from '@mui/joy';

export default function DratingDetail() {
    const { drno } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [form, setForm] = useState(null);
    const [open, setOpen] = useState(false); // 삭제 모달

    // ✅ 상세 조회
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getDratingDetail(token, drno);
                setForm(res.data);
            } catch {
                alert('상세 조회 실패');
            }
        };
        fetch();
    }, [drno, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const res = await updateDrating(token, form);
            if (res.data) alert('수정 완료');
        } catch {
            alert('수정 실패');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteDrating(token, drno);
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

    if (!form) return <Typography>로딩 중...</Typography>;

    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#fff' }}>
            <Typography level="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#12b886' }}>
                🧾 개발자 평가 상세
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input name="dtitle" value={form.dtitle || ''} onChange={handleChange} placeholder="제목" />
                <Input name="dcontent" value={form.dcontent || ''} onChange={handleChange} placeholder="내용" />
                <Input name="drscore" type="number" value={form.drscore || ''} onChange={handleChange} placeholder="점수" />
                <Input name="drstate" value={form.drstate || ''} onChange={handleChange} placeholder="상태코드" />

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button onClick={handleUpdate} variant="outlined" sx={{ borderColor: '#12b886', color: '#12b886' }}>
                        수정
                    </Button>
                    <Button color="danger" onClick={() => setOpen(true)}>삭제</Button>
                </Box>
            </Box>

            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" sx={{ bgcolor: '#fff' }}>
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#d9480f' }}>정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        이 평가는 복구할 수 없습니다.
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