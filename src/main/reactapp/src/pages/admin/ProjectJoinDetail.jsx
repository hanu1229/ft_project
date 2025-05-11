// =======================================================================================
// ProjectJoinDetail.jsx | rw 25-05-11 최종 안정화 (Select 도입, 관리자 전용 API 기준)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectJoinDetail, updateProjectJoin, deleteProjectJoin } from '../../api/projectJoinApi';
import {
    Typography, Box, Button, Divider, Modal,
    ModalDialog, ModalClose, Select, Option
} from '@mui/joy';

export default function ProjectJoinDetail() {
    const { pjno } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [form, setForm] = useState(null);
    const [open, setOpen] = useState(false);

    // ✅ 상세 조회
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getProjectJoinDetail(token, pjno);
                setForm(res.data);
            } catch {
                alert('프로젝트참여 상세 조회 실패');
            }
        };
        fetch();
    }, [pjno, token]);

    // ✅ 상태코드 변경 처리
    const handleUpdate = async () => {
        try {
            const res = await updateProjectJoin(token, {
                pjno: form.pjno,
                pjtype: parseInt(form.pjtype, 10),
            });
            if (res.data) alert('수정 완료');
        } catch {
            alert('수정 실패');
        }
    };

    // ✅ 삭제 처리
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
                <Select
                    name="pjtype"
                    value={form.pjtype?.toString() ?? ''}
                    onChange={(e, value) => setForm({ ...form, pjtype: parseInt(value) })}
                    placeholder="참여 상태 선택"
                >
                    <Option value="0">🚨 신고 접수됨</Option>
                    <Option value="2">✅ 문제 없음 (반려 처리)</Option>
                </Select>

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