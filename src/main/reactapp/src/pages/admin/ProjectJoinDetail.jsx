// =======================================================================================
// ProjectJoinDetail.jsx | rw 25-05-10 최종 리팩토링
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectJoinDetail, updateProjectJoin, deleteProjectJoin } from '../../api/projectJoinApi.js';
import { Typography, Box, Input, Button, Divider, Modal, ModalDialog, ModalClose } from '@mui/joy';

export default function ProjectJoinDetail() {
    const { pjno } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [form, setForm] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getProjectJoinDetail(token, pjno);
                setForm(res.data);
            } catch {
                alert('상세 조회 실패');
            }
        };
        fetch();
    }, [pjno, token]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const res = await updateProjectJoin(token, form);
            if (res.data) alert('수정 완료');
        } catch {
            alert('수정 실패');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteProjectJoin(token, pjno);
            if (res.data) {
                alert('삭제 완료');
                navigate('/admin/project-join');
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
                🤝 프로젝트 참여 상세
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ maxWidth: 500, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input name="pjcomment" value={form.pjcomment || ''} onChange={handleChange} placeholder="신청 메모" />
                <Input name="pjstate" value={form.pjstate || ''} onChange={handleChange} placeholder="상태코드" />

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button onClick={handleUpdate} variant="outlined" sx={{ borderColor: '#12b886', color: '#12b886' }}>
                        수정
                    </Button>
                    <Button color="danger" onClick={() => setOpen(true)}>삭제</Button>
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