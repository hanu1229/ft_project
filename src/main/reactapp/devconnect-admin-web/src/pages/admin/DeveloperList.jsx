// DeveloperList.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 전용 개발자 목록 조회 화면
//        - Joy UI + 넷플릭스 블랙&핑크 테마 적용
//        - 상세보기, 삭제(확인 모달 포함) 기능 제공

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeveloperList, deleteDeveloper } from '../../api/developerApi';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Typography,
    Grid,
    Card,
    Box,
    Divider,
    Button,
    Modal,
    ModalDialog,
    ModalClose
} from '@mui/joy';

export default function DeveloperList() {
    const [list, setList] = useState([]);              // 전체 개발자 목록
    const [deleteTarget, setDeleteTarget] = useState(null); // 삭제 대상
    const [open, setOpen] = useState(false);           // 삭제 확인 모달
    const navigate = useNavigate();

    // ✅ 전체 개발자 목록 불러오기
    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await getDeveloperList();
                setList(res.data);
            } catch (err) {
                alert('개발자 목록 조회 실패');
            }
        };
        fetchList();
    }, []);

    // ✅ 삭제 확정 처리
    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await deleteDeveloper(deleteTarget, token);
            if (res.data) {
                alert('삭제 완료');
                setList((prev) => prev.filter((dev) => dev.dno !== deleteTarget));
            }
        } catch (err) {
            alert('삭제 실패');
        } finally {
            setOpen(false);
            setDeleteTarget(null);
        }
    };

    return (
        <div>
            {/* 타이틀 */}
            <Typography level="h3" sx={{ mb: 3, color: '#ff4081', fontWeight: 'bold' }}>
                👨‍💻 개발자 목록
            </Typography>

            {/* 개발자 카드 목록 */}
            <Grid container spacing={2}>
                {list.map((dev) => (
                    <Grid key={dev.dno} xs={12} md={6} lg={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#1e1e1e',
                                color: '#fff',
                                borderColor: '#ff4081',
                                boxShadow: '0 0 10px rgba(255,64,129,0.2)'
                            }}
                        >
                            <Typography level="title-md" sx={{ color: '#ff4081' }}>
                                개발자번호: {dev.dno}
                            </Typography>
                            <Divider sx={{ my: 1, borderColor: '#333' }} />
                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>아이디:</strong> {dev.did}</p>
                                <p><strong>이름:</strong> {dev.dname}</p>
                                <p><strong>상태코드:</strong> {dev.dstate}</p>
                            </Box>

                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Button
                                    onClick={() => navigate(`/admin/developer/${dev.dno}`)}
                                    variant="outlined"
                                    sx={{
                                        borderColor: '#ff4081',
                                        color: '#ff4081',
                                        '&:hover': { bgcolor: '#ff4081', color: '#000' }
                                    }}
                                >
                                    상세보기
                                </Button>
                                <Button
                                    color="danger"
                                    onClick={() => {
                                        setDeleteTarget(dev.dno);
                                        setOpen(true);
                                    }}
                                >
                                    삭제
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 삭제 확인 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog
                    variant="outlined"
                    role="alertdialog"
                    sx={{ bgcolor: '#1e1e1e', color: '#fff' }}
                >
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#ff4081' }}>
                        정말 삭제하시겠습니까?
                    </Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 개발자 정보는 복구할 수 없습니다.
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
