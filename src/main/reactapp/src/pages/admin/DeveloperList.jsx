// =======================================================================================
// DeveloperList.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 개발자 전체 목록 페이지
// - Joy UI + ChatGPT 스타일: 흰 배경 + 절제된 민트/회색 UI
// - 삭제 확인 모달, 상세보기 라우팅 포함
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDeveloperList, deleteDeveloper } from '../../api/developerApi.js';

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
    const [list, setList] = useState([]);                  // ✅ 전체 개발자 목록
    const [deleteTarget, setDeleteTarget] = useState(null); // ✅ 삭제 대상 dno
    const [open, setOpen] = useState(false);               // ✅ 모달 열림 여부
    const navigate = useNavigate();

    // =======================================================================================
    // ✅ 전체 개발자 목록 불러오기 (최초 마운트 시 1회)
    // =======================================================================================
    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await getDeveloperList();
                setList(res.data);
            } catch (err) {
                alert('개발자 목록 조회 실패');
                console.error(err);
            }
        };
        fetchList();
    }, []);

    // =======================================================================================
    // ✅ 삭제 확정 처리
    // =======================================================================================
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

    // =======================================================================================
    // ✅ 렌더링
    // =======================================================================================
    return (
        <Box sx={{ bgcolor: '#ffffff', color: '#212529', px: 3, py: 3 }}>
            {/* ✅ 페이지 타이틀 */}
            <Typography level="h3" sx={{ mb: 3, fontWeight: 'bold', color: '#12b886' }}>
                👨‍💻 개발자 목록
            </Typography>

            {/* ✅ 카드 목록 */}
            <Grid container spacing={2}>
                {list.map((dev) => (
                    <Grid key={dev.dno} xs={12} md={6} lg={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#f8f9fa',
                                borderColor: '#dee2e6',
                                color: '#212529',
                                '&:hover': { boxShadow: 'lg' }
                            }}
                        >
                            <Typography level="title-md" sx={{ color: '#087f5b' }}>
                                개발자번호: {dev.dno}
                            </Typography>

                            <Divider sx={{ my: 1, borderColor: '#ced4da' }} />

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
                                        borderColor: '#087f5b',
                                        color: '#087f5b',
                                        fontWeight: 'bold',
                                        '&:hover': {
                                            bgcolor: '#087f5b',
                                            color: '#fff'
                                        }
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

            {/* ✅ 삭제 확인 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog
                    variant="outlined"
                    role="alertdialog"
                    sx={{
                        bgcolor: '#fff',
                        color: '#212529',
                        borderColor: '#ff6b6b'
                    }}
                >
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>
                        정말 삭제하시겠습니까?
                    </Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 개발자 정보는 복구할 수 없습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="plain" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDeleteConfirm}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Box>
    );
}