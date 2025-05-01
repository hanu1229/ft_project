// DeveloperList.jsx | rw 25-05-01
// [설명] 전체 개발자 목록 조회 및 삭제 기능 포함
//        - 리스트에서 개발자 요약 정보 출력
//        - 상세 보기, 삭제 기능 제공

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeveloperList, deleteDeveloper } from '../../api/developerApi';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Typography, Grid, Card, Box, Divider, Button,
    Modal, ModalDialog, ModalClose
} from '@mui/joy';

export default function DeveloperList() {
    const [list, setList] = useState([]);          // [1] 개발자 목록 상태
    const [deleteTarget, setDeleteTarget] = useState(null); // [2] 삭제할 개발자 번호 저장
    const [open, setOpen] = useState(false);       // [3] 모달 상태
    const navigate = useNavigate();

    // [4] 전체 목록 조회
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getDeveloperList();
                setList(res.data);
            } catch (err) {
                alert('개발자 목록 조회 실패');
            }
        };
        fetchData();
    }, []);

    // [5] 삭제 확정 처리
    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await deleteDeveloper(deleteTarget, token);
            if (res.data) {
                alert('삭제 성공');
                setList(list.filter(dev => dev.dno !== deleteTarget));
            }
        } catch (err) {
            alert('삭제 실패');
        } finally {
            setOpen(false);
            setDeleteTarget(null);
        }
    };

    return (
        <AdminLayout>
            <Typography level="h3" sx={{ mb: 3 }}>개발자 목록</Typography>
            <Grid container spacing={2}>
                {list.map((dev) => (
                    <Grid key={dev.dno} xs={12} md={6} lg={4}>
                        <Card variant="outlined">
                            <Typography level="title-md">개발자번호: {dev.dno}</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box>
                                <p><strong>아이디:</strong> {dev.did}</p>
                                <p><strong>이름:</strong> {dev.dname}</p>
                                <p><strong>상태코드:</strong> {dev.dstate}</p>
                            </Box>
                            <Button onClick={() => navigate(`/admin/developer/${dev.dno}`)}>상세보기</Button>
                            <Button color="danger" onClick={() => {
                                setDeleteTarget(dev.dno);
                                setOpen(true);
                            }}>삭제</Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 삭제 확인 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <ModalClose />
                    <Typography level="h4">정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 개발자 정보는 복구할 수 없습니다.
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