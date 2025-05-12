// =======================================================================================
// CratingDetail.jsx | rw 25-05-11 최종 안정화 (관리자 전용 기업평가 상세/수정/삭제)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCratingDetail, updateCrating, deleteCrating } from '../../api/cratingApi';
import {
    Typography, Box, Input, Button, Divider, Modal,
    ModalDialog, ModalClose, Select, Option
} from '@mui/joy';

export default function CratingDetail() {
    const { crno } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [form, setForm] = useState(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getCratingDetail(token, crno);
                setForm(res.data);
            } catch {
                alert('상세 조회 실패');
            }
        };
        fetch();
    }, [crno, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const res = await updateCrating(token, form);
            if (res.data) alert('수정 완료');
        } catch {
            alert('수정 실패');
        }
    };

    const handleDelete = async () => {
        try {
            const res = await deleteCrating(token, crno);
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

    if (!form) return <Typography>로딩 중...</Typography>;

    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#fff' }}>
            <Typography level="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#12b886' }}>
                📝 기업 평가 상세
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input name="ctitle" value={form.ctitle || ''} onChange={handleChange} placeholder="제목" />
                <Input name="ccontent" value={form.ccontent || ''} onChange={handleChange} placeholder="내용" />
                <Input name="crscore" type="number" value={form.crscore || ''} onChange={handleChange} placeholder="점수" />

                <Select
                    name="crstate"
                    value={form.crstate?.toString() ?? ''}
                    onChange={(e, value) => setForm({ ...form, crstate: parseInt(value) })}
                    placeholder="상태 선택"
                >
                    <Option value="0">📥 대기</Option>
                    <Option value="1">✅ 승인</Option>
                    <Option value="2">❌ 반려</Option>
                </Select>

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