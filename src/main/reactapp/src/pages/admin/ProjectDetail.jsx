// =======================================================================================
// ProjectDetail.jsx | rw 25-05-11 ProjectJoin 스타일 통합 리팩토링 (자율거래 기반)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectDetail, updateProject, deleteProject } from '../../api/projectApi';
import {
    Typography, Box, Input, Button, Divider,
    Modal, ModalDialog, ModalClose
} from '@mui/joy';

export default function ProjectDetail() {
    const { pno } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [form, setForm] = useState(null);
    const [open, setOpen] = useState(false);

    // ✅ 상세 조회
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getProjectDetail(token, pno);
                setForm(res.data);
            } catch {
                alert('프로젝트 상세 조회 실패');
            }
        };
        fetch();
    }, [pno, token]);

    // ✅ 수정 요청 (FormData 기반)
    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                if (value !== null && value !== undefined) {
                    formData.append(key, value);
                }
            });

            const res = await updateProject(token, formData);
            if (res.data) alert('수정 완료');
        } catch {
            alert('수정 실패');
        }
    };

    // ✅ 삭제 요청
    const handleDelete = async () => {
        try {
            const res = await deleteProject(token, pno);
            if (res.data) {
                alert('삭제 완료');
                navigate('/admin/project');
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
                📁 프로젝트 상세
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input name="pname" value={form.pname || ''} onChange={e => setForm({ ...form, pname: e.target.value })} placeholder="프로젝트명" />
                <Input name="pintro" value={form.pintro || ''} onChange={e => setForm({ ...form, pintro: e.target.value })} placeholder="한줄소개" />
                <Input name="pcomment" value={form.pcomment || ''} onChange={e => setForm({ ...form, pcomment: e.target.value })} placeholder="설명" />
                <Input name="ppay" type="number" value={form.ppay || ''} onChange={e => setForm({ ...form, ppay: e.target.value })} placeholder="페이 (만원)" />

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button onClick={handleUpdate} variant="outlined" sx={{ borderColor: '#12b886', color: '#12b886' }}>
                        수정
                    </Button>
                    <Button color="danger" onClick={() => setOpen(true)}>직권 삭제</Button>
                </Box>
            </Box>

            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined">
                    <ModalClose />
                    <Typography level="h4">정말 삭제하시겠습니까?</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="plain" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDelete}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Box>
    );
}