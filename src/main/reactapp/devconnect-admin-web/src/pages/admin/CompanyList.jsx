// CompanyList.jsx | rw 25-05-01
// [설명] 기업 전체 목록 조회 + 삭제 + 통합 검색 + 상태 필터링 + 상태별 통계 카드

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyList, deleteCompany } from '../../api/companyApi';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Typography, Grid, Card, Box, Divider, Button,
    Input, Select, Option,
    Modal, ModalDialog, ModalClose
} from '@mui/joy';

export default function CompanyList() {
    const [list, setList] = useState([]);                  // [1] 전체 기업 목록
    const [search, setSearch] = useState('');              // [2] 검색어
    const [filter, setFilter] = useState('all');           // [3] 상태 필터값
    const [open, setOpen] = useState(false);               // [4] 모달 열림 여부
    const [deleteTarget, setDeleteTarget] = useState(null);// [5] 삭제 대상
    const navigate = useNavigate();

    // [6] 기업 목록 불러오기
    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await getCompanyList();
                setList(res.data);
            } catch (err) {
                alert('기업 목록 조회 실패');
            }
        };
        fetchList();
    }, []);

    // [7] 상태별 통계 계산
    const stats = useMemo(() => {
        return {
            total: list.length,
            approved: list.filter(c => c.cstate === 1).length,
            pending: list.filter(c => c.cstate === 0).length,
            deleted: list.filter(c => c.cstate === 9).length,
        };
    }, [list]);

    // [8] 검색 + 필터 적용된 목록
    const filtered = list.filter(c =>
        (filter === 'all' || String(c.cstate) === filter) &&
        (search === '' || c.cname.includes(search) || c.ceo.includes(search))
    );

    // [9] 삭제 확정 처리
    const handleDeleteConfirm = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await deleteCompany(deleteTarget, token);
            if (res.data) {
                alert('삭제 완료');
                setList(list.filter(c => c.cno !== deleteTarget));
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
            {/* [10] 페이지 제목 */}
            <Typography level="h3" sx={{ mb: 2 }}>기업 목록</Typography>

            {/* [11] 통계 카드 */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid xs={12} sm={4}><Card>전체 기업: {stats.total}</Card></Grid>
                <Grid xs={12} sm={4}><Card>승인: {stats.approved}</Card></Grid>
                <Grid xs={12} sm={4}><Card>대기: {stats.pending}</Card></Grid>
            </Grid>

            {/* [12] 필터 + 검색 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Select value={filter} onChange={(e, val) => setFilter(val)}>
                    <Option value="all">전체</Option>
                    <Option value="0">대기(0)</Option>
                    <Option value="1">승인(1)</Option>
                    <Option value="9">삭제(9)</Option>
                </Select>
                <Input
                    placeholder="기업명 또는 대표자 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </Box>

            {/* [13] 기업 카드 목록 */}
            <Grid container spacing={2}>
                {filtered.map((c) => (
                    <Grid key={c.cno} xs={12} md={6} lg={4}>
                        <Card variant="outlined">
                            <Typography level="title-md">{c.cname}</Typography>
                            <Divider sx={{ my: 1 }} />
                            <Box>
                                <p><strong>기업번호:</strong> {c.cno}</p>
                                <p><strong>대표자:</strong> {c.ceo}</p>
                                <p><strong>상태코드:</strong> {c.cstate}</p>
                            </Box>
                            <Button onClick={() => navigate(`/admin/company/${c.cno}`)}>상세보기</Button>
                            <Button color="danger" onClick={() => {
                                setDeleteTarget(c.cno);
                                setOpen(true);
                            }}>삭제</Button>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* [14] 삭제 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <ModalClose />
                    <Typography level="h4">정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 기업 정보는 복구할 수 없습니다.
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