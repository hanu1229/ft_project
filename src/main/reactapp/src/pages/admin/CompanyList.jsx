// CompanyList.jsx | 최종 리팩토링 25-05-02
// [설명]
// - Joy UI 기반 기업 전체 목록 화면
// - ChatGPT.com 감성 흰 배경 + 민트 포인트 UI
// - 필터링, 검색, 삭제, 상세 이동 포함

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyList, deleteCompany } from '../../api/companyApi.js';
import {
    Typography,
    Grid,
    Card,
    Box,
    Divider,
    Button,
    Input,
    Select,
    Option,
    Modal,
    ModalDialog,
    ModalClose
} from '@mui/joy';

export default function CompanyList() {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [open, setOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const navigate = useNavigate();

    // ✅ 기업 목록 조회
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

    // ✅ 상태별 통계 계산
    const stats = useMemo(() => ({
        total: list.length,
        approved: list.filter(c => c.cstate === 1).length,
        pending: list.filter(c => c.cstate === 0).length,
        deleted: list.filter(c => c.cstate === 9).length,
    }), [list]);

    // ✅ 필터 + 검색
    const filtered = list.filter(c =>
        (filter === 'all' || String(c.cstate) === filter) &&
        (search === '' || c.cname.includes(search) || c.ceo.includes(search))
    );

    // ✅ 삭제 처리
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
        <Box sx={{ px: 3, py: 3, bgcolor: '#ffffff', color: '#222' }}>
            {/* ✅ 타이틀 */}
            <Typography level="h3" sx={{ mb: 3, fontWeight: 'bold', color: '#12b886' }}>
                🏢 기업 목록
            </Typography>

            {/* ✅ 통계 카드 */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    ['전체', stats.total],
                    ['승인', stats.approved],
                    ['대기', stats.pending]
                ].map(([label, count], idx) => (
                    <Grid key={idx} xs={12} sm={4}>
                        <Card sx={{
                            bgcolor: '#f8f9fa',
                            border: '1px solid #dee2e6',
                            color: '#212529',
                            fontWeight: 'bold'
                        }}>
                            {label}: <span style={{ color: '#12b886' }}>{count}</span>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ✅ 필터 + 검색 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Select
                    value={filter}
                    onChange={(e, val) => setFilter(val)}
                    sx={{ minWidth: 120 }}
                    variant="soft"
                >
                    <Option value="all">전체</Option>
                    <Option value="0">대기</Option>
                    <Option value="1">승인</Option>
                    <Option value="9">삭제</Option>
                </Select>
                <Input
                    placeholder="기업명 또는 대표자 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    variant="soft"
                    sx={{ flex: 1 }}
                />
            </Box>

            {/* ✅ 기업 리스트 카드 */}
            <Grid container spacing={2}>
                {filtered.map(c => (
                    <Grid key={c.cno} xs={12} sm={6} md={4}>
                        <Card
                            variant="outlined"
                            sx={{
                                bgcolor: '#fefefe',
                                borderColor: '#12b886',
                                color: '#222',
                                '&:hover': { boxShadow: 'md' }
                            }}
                        >
                            <Typography level="title-md" sx={{ color: '#12b886', fontWeight: 'bold' }}>
                                {c.cname}
                            </Typography>
                            <Divider sx={{ my: 1, borderColor: '#ccc' }} />
                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>기업번호:</strong> {c.cno}</p>
                                <p><strong>대표자:</strong> {c.ceo}</p>
                                <p><strong>상태:</strong> {c.cstate}</p>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Button
                                    variant="outlined"
                                    color="neutral"
                                    onClick={() => navigate(`/admin/company/${c.cno}`)}
                                    sx={{ borderColor: '#12b886', color: '#12b886', fontWeight: 500 }}
                                >
                                    상세보기
                                </Button>
                                <Button
                                    color="danger"
                                    onClick={() => {
                                        setDeleteTarget(c.cno);
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

            {/* ✅ 삭제 확인 모델 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" sx={{ bgcolor: '#fff', color: '#000' }}>
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#d9480f' }}>
                        정말 삭제하시겠습니까?
                    </Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        이 작업은 도보를 수 없습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="soft" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDeleteConfirm}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </Box>
    );
}