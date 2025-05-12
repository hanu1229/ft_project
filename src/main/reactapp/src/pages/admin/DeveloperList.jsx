// =======================================================================================
// DeveloperList.jsx | rw 25-05-11 최종 리팩토링 (관리자 전용)
// [설명] 관리자 권한으로 전체 개발자 목록 조회 + 상세 이동 + 삭제 기능 제공
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeveloperList, deleteDeveloper } from '../../api/developerApi.js';
import {
    Typography, Grid, Card, Box, Button, Modal, ModalDialog, ModalClose
} from '@mui/joy';

export default function DeveloperList() {
    const [list, setList] = useState([]);
    const [open, setOpen] = useState(false);
    const [targetDno, setTargetDno] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    // ✅ 전체 목록 조회
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getDeveloperList(token);
                setList(res.data);
            } catch {
                alert('개발자 목록 조회 실패');
            }
        };
        fetch();
    }, [token]);

    // ✅ 삭제 처리
    const handleDelete = async () => {
        try {
            const res = await deleteDeveloper(targetDno, token);
            if (res.data) {
                alert('삭제 완료');
                setList(prev => prev.filter(dev => dev.dno !== targetDno));
            }
        } catch {
            alert('삭제 실패');
        } finally {
            setOpen(false);
            setTargetDno(null);
        }
    };

    return (
        <Box sx={{ px: 3, py: 3 }}>
            <Typography level="h3" sx={{ mb: 3, color: '#12b886', fontWeight: 'bold' }}>
                👨‍💻 개발자 목록
            </Typography>

            <Grid container spacing={2}>
                {list.map((dev) => (
                    <Grid key={dev.dno} xs={12} sm={6} md={4}>
                        <Card variant="outlined" sx={{ bgcolor: '#f8f9fa', p: 2 }}>
                            <Typography level="title-md" sx={{ fontWeight: 'bold', color: '#12b886' }}>
                                {dev.dname}
                            </Typography>
                            <Box sx={{ fontSize: 14, mt: 1 }}>
                                <p><strong>번호:</strong> {dev.dno}</p>
                                <p><strong>이메일:</strong> {dev.demail}</p>
                                <p><strong>상태:</strong> {dev.dstate ? '정상' : '비활성'}</p>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Button onClick={() => navigate(`/admin/developer/${dev.dno}`)}>
                                    상세
                                </Button>
                                <Button color="danger" onClick={() => { setTargetDno(dev.dno); setOpen(true); }}>
                                    삭제
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ✅ 삭제 확인 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined">
                    <ModalClose />
                    <Typography level="h4">정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm">이 작업은 되돌릴 수 없습니다.</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="soft" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDelete}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Box>
    );
}