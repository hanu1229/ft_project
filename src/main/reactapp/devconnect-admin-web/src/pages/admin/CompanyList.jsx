// CompanyList.jsx | 최종 리팩토링 25-05-02
// [설명] Joy UI 기반 기업 전체 목록 화면
// - 블랙&핑크 테마 + 통계 카드 + 필터링 + 검색 + 삭제 + 상세 이동

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyList, deleteCompany } from '../../api/companyApi';
import AdminLayout from '../../layouts/AdminLayout';
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
    const [list, setList] = useState([]);           // 전체 기업 목록
    const [search, setSearch] = useState('');       // 검색어
    const [filter, setFilter] = useState('all');    // 상태 필터
    const [open, setOpen] = useState(false);        // 삭제 모달
    const [deleteTarget, setDeleteTarget] = useState();
    const navigate = useNavigate();

    // ✅ 데이터 로딩
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

    // ✅ 상태 필터링별 통계
    const stats = useMemo(() => ({
        total: list.length,
        approved: list.filter(c => c.cstate === 1).length,
        pending: list.filter(c => c.cstate === 0).length,
        deleted: list.filter(c => c.cstate === 9).length,
    }), [list]);

    // ✅ 필터 + 검색 적용
    const filtered = list.filter(c =>
        (filter === 'all' || String(c.cstate) === filter) &&
        (search === '' || c.cname.includes(search) || c.ceo.includes(search))
    );

    // ✅ 삭제 실행
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
        <div>
            {/* 제목 */}
            <Typography level="h3" sx={{ mb: 3, color: '#ff4081', fontWeight: 'bold' }}>
                🏢 기업 목록
            </Typography>

            {/* 통계 카드 */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {[
                    ['전체', stats.total],
                    ['승인', stats.approved],
                    ['대기', stats.pending],
                ].map(([label, value], idx) => (
                    <Grid key={idx} xs={12} sm={4}>
                        <Card sx={{ bgcolor: '#1e1e1e', color: label === '전체' ? '#fff' : '#ff4081' }}>
                            {label}: <strong>{value}</strong>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 필터 & 검색 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Select
                    value={filter}
                    onChange={(e, val) => setFilter(val)}
                    sx={{ minWidth: 120, bgcolor: '#000', color: '#fff' }}
                >
                    <Option value="all">전체</Option>
                    <Option value="0">대기 (0)</Option>
                    <Option value="1">승인 (1)</Option>
                    <Option value="9">삭제 (9)</Option>
                </Select>

                <Input
                    placeholder="기업명 또는 대표자 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flex: 1, bgcolor: '#000', color: '#fff' }}
                />
            </Box>

            {/* 기업 카드 */}
            <Grid container spacing={2}>
                {filtered.map((c) => (
                    <Grid key={c.cno} xs={12} md={6} lg={4}>
                        <Card variant="outlined" sx={{
                            bgcolor: '#1e1e1e',
                            color: '#fff',
                            borderColor: '#ff4081'
                        }}>
                            <Typography level="title-md" sx={{ color: '#ff4081' }}>{c.cname}</Typography>
                            <Divider sx={{ my: 1, borderColor: '#333' }} />
                            <Box sx={{ fontSize: 14 }}>
                                <p><strong>기업번호:</strong> {c.cno}</p>
                                <p><strong>대표자:</strong> {c.ceo}</p>
                                <p><strong>상태코드:</strong> {c.cstate}</p>
                            </Box>
                            <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                                <Button
                                    onClick={() => navigate(`/admin/company/${c.cno}`)}
                                    variant="outlined"
                                    sx={{ borderColor: '#ff4081', color: '#ff4081', '&:hover': { bgcolor: '#ff4081', color: '#000' } }}
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

            {/* 삭제 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" sx={{ bgcolor: '#1e1e1e', color: '#fff' }}>
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#ff4081' }}>정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 기업 정보는 복구할 수 없습니다.
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