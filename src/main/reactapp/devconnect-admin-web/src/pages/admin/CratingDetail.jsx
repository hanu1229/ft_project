// CratingDetail.jsx | rw 25-05-02 (최종 리팩토링)
// [설명] 관리자 전용 기업 평가 상세 화면
//        - 상세 조회 + 수정 + 승인 + 삭제 가능
//        - Joy UI + 넷플릭스 스타일 테마 반영

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getCratingDetail,
    approveCrating,
    updateCrating,
    deleteCrating
} from '../../api/cratingApi';
import AdminLayout from '../../layouts/AdminLayout';
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
    const [crating, setCrating] = useState(null);          // ✅ 원본 데이터
    const [form, setForm] = useState({});                  // ✅ 수정용 상태
    const [open, setOpen] = useState(false);               // ✅ 삭제 모달
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // ✅ 상세 조회
    useEffect(() => {
        (async () => {
            try {
                const res = await getCratingDetail(crno, token);
                setCrating(res.data);
                setForm(res.data);
            } catch (err) {
                alert('기업 평가 상세 조회 실패');
            }
        })();
    }, [crno, token]);

    // ✅ 입력값 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ 수정 요청
    const handleUpdate = async () => {
        try {
            const res = await updateCrating(token, form);
            if (res.data) alert('수정 완료');
        } catch {
            alert('수정 실패');
        }
    };

    // ✅ 승인 요청
    const handleApprove = async () => {
        try {
            const res = await approveCrating(crno, token);
            if (res.data) {
                alert('승인 완료');
                setCrating({ ...crating, crstate: 1 });
            }
        } catch {
            alert('승인 실패');
        }
    };

    // ✅ 삭제 확정 요청
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

    if (!crating) return <p style={{ color: '#fff' }}>로딩 중...</p>;

    return (
        <div>
            <Typography level="h3" sx={{ mb: 2, color: '#ff4081', fontWeight: 'bold' }}>
                📝 기업 평가 상세
            </Typography>

            <Divider sx={{ mb: 3, borderColor: '#ff4081' }} />

            <Box sx={{
                display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 480,
                bgcolor: '#1e1e1e', p: 3, borderRadius: 'lg', border: '1px solid #ff4081',
                boxShadow: '0 0 20px rgba(255,64,129,0.2)', color: '#fff'
            }}>
                {/* 입력 필드 */}
                <Input name="crtitle" value={form.crtitle || ''} onChange={handleChange} placeholder="제목" sx={{ bgcolor: '#000', color: '#fff' }} />
                <Input name="crcontent" value={form.crcontent || ''} onChange={handleChange} placeholder="내용" sx={{ bgcolor: '#000', color: '#fff' }} />
                <Input name="crscore" value={form.crscore || ''} onChange={handleChange} placeholder="점수" type="number" sx={{ bgcolor: '#000', color: '#fff' }} />
                <Input name="crstate" value={form.crstate || ''} onChange={handleChange} placeholder="상태코드" sx={{ bgcolor: '#000', color: '#fff' }} />

                {/* 버튼 그룹 */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button onClick={handleUpdate} variant="outlined" sx={{ borderColor: '#ff4081', color: '#ff4081', '&:hover': { bgcolor: '#ff4081', color: '#000' } }}>
                        수정
                    </Button>
                    <Button onClick={handleApprove} variant="outlined" sx={{ borderColor: '#00e676', color: '#00e676', '&:hover': { bgcolor: '#00e676', color: '#000' } }}>
                        승인
                    </Button>
                    <Button color="danger" onClick={() => setOpen(true)}>
                        삭제
                    </Button>
                </Box>
            </Box>

            {/* 삭제 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog" sx={{ bgcolor: '#1e1e1e', color: '#fff' }}>
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#ff4081' }}>
                        정말 삭제하시겠습니까?
                    </Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 평가는 복구할 수 없습니다.
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