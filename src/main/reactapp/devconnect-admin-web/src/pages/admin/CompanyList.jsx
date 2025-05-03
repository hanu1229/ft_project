// =======================================================================================
// CompanyList.jsx | rw 25-05-03 확장 리팩토링 (v6)
// [설명]
// - ✅ Joy UI 기업 목록 화면 확장버전
// - ✅ 상태 뱃지 / ✅ 썸네일 / ✅ 정렬 / ✅ 검색 / ✅ 필터 / ✅ 페이지네이션
// - ✅ 통계 카드 클릭 필터링 / ✅ 썸네일 확대 / ✅ CSV 다운로드 / ✅ 정렬 UI / ✅ 탭
// - ✅ 페이지당 개수 선택 / ✅ 직접 페이지 이동 / ✅ 현재 범위 표시 / ✅ 로딩 스피너
// =======================================================================================

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCompanyList } from '../../api/companyApi';
import StatusBadge from '../../components/StatusBadge';
import CustomPagination from '../../components/CustomPagination';
import {
    Typography, Grid, Card, Box, Divider, Button, Input,
    Select, Option, Modal, ModalDialog, ModalClose, Tabs,
    TabList, Tab, DialogTitle, DialogContent, IconButton
} from '@mui/joy';
import { Download, Image as ImageIcon } from 'lucide-react';

export default function CompanyList() {
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [sortKey, setSortKey] = useState('cname');
    const [sortOrder, setSortOrder] = useState('asc');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(9);
    const [openImg, setOpenImg] = useState(false);
    const [previewImg, setPreviewImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const res = await getCompanyList();
                setList(res.data);
            } catch {
                alert('기업 목록 조회 실패');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    const stats = useMemo(() => ({
        total: list.length,
        approved: list.filter(c => c.state === 1).length,
        pending: list.filter(c => c.state === 0).length,
        deleted: list.filter(c => c.state === 9).length,
    }), [list]);

    const filtered = useMemo(() => {
        let result = list.filter(c =>
            (filter === 'all' || String(c.state) === filter) &&
            (search === '' || c.cname.includes(search) || c.cid.includes(search))
        );
        return [...result].sort((a, b) => {
            let aVal = a[sortKey];
            let bVal = b[sortKey];
            return sortOrder === 'asc'
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        });
    }, [list, filter, search, sortKey, sortOrder]);

    const pageCount = Math.ceil(filtered.length / perPage);
    const paged = filtered.slice((page - 1) * perPage, page * perPage);
    const from = (page - 1) * perPage + 1;
    const to = Math.min(page * perPage, filtered.length);

    const exportCSV = () => {
        const header = ['기업명', '아이디', '사업자번호', '상태'];
        const rows = filtered.map(c => [c.cname, c.cid, c.cbusiness, c.state]);
        const csv = [header, ...rows].map(e => e.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'company_list.csv');
        link.click();
    };

    return (
        <Box sx={{ px: 3, py: 3 }}>
            <Typography level="h3" sx={{ color: '#12b886', mb: 2, fontWeight: 600 }}>🏢 기업 목록</Typography>

            {/* 통계 카드 */}
            <Grid container spacing={2} sx={{ mb: 2 }}>
                {[
                    ['전체', 'all', stats.total, '#12b886'],
                    ['승인', '1', stats.approved, '#51cf66'],
                    ['대기', '0', stats.pending, '#fcc419'],
                    ['삭제', '9', stats.deleted, '#ff6b6b']
                ].map(([label, key, count, color], i) => (
                    <Grid key={i} xs={6} sm={3}>
                        <Card onClick={() => setFilter(key)} sx={{ cursor: 'pointer', borderLeft: `5px solid ${color}` }}>
                            {label}: <strong style={{ color }}>{count}</strong>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 탭 + 검색 + 정렬 */}
            <Tabs value={filter} onChange={(e, val) => setFilter(val)} sx={{ mb: 2 }}>
                <TabList>
                    <Tab value="all">전체</Tab>
                    <Tab value="1">승인</Tab>
                    <Tab value="0">대기</Tab>
                    <Tab value="9">삭제</Tab>
                </TabList>
            </Tabs>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Select value={sortKey} onChange={(e, val) => setSortKey(val)} variant="soft">
                    <Option value="cname">기업명</Option>
                    <Option value="createAt">가입일</Option>
                </Select>
                <Select value={sortOrder} onChange={(e, val) => setSortOrder(val)} variant="soft">
                    <Option value="asc">오름차순</Option>
                    <Option value="desc">내림차순</Option>
                </Select>
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="기업명, 아이디 검색" sx={{ flex: 1 }} />
                <Button variant="soft" onClick={exportCSV} startDecorator={<Download size={16} />}>CSV</Button>
            </Box>

            {/* 목록 or 로딩 */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
                    <Typography level="body-md" color="neutral">로딩 중...</Typography>
                </Box>
            ) : (
                <Grid container spacing={2}>
                    {paged.map(c => (
                        <Grid key={c.cno} xs={12} sm={6} md={4}>
                            <Card variant="outlined" sx={{ borderColor: '#12b886' }}>
                                <Typography level="title-md" sx={{ color: '#12b886', fontWeight: 'bold' }}>{c.cname}</Typography>
                                <Divider sx={{ my: 1 }} />
                                {c.cprofile ? (
                                    <Box sx={{ position: 'relative' }}>
                                        <img
                                            src={`/images/${c.cprofile}`}
                                            alt="profile"
                                            style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, cursor: 'pointer' }}
                                            onClick={() => { setPreviewImg(`/images/${c.cprofile}`); setOpenImg(true); }}
                                        />
                                        <IconButton
                                            variant="soft"
                                            size="sm"
                                            sx={{ position: 'absolute', top: 5, right: 5 }}
                                            onClick={() => { setPreviewImg(`/images/${c.cprofile}`); setOpenImg(true); }}
                                        >
                                            <ImageIcon size={16} />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Box sx={{ height: 140, bgcolor: '#f1f3f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography level="body-sm" color="neutral">이미지 없음</Typography>
                                    </Box>
                                )}

                                <Box sx={{ mt: 1, fontSize: 14 }}>
                                    <p><strong>ID:</strong> {c.cid}</p>
                                    <p><strong>사업자번호:</strong> {c.cbusiness}</p>
                                    <p><strong>상태:</strong> <StatusBadge code={c.state} type="company" /></p>
                                </Box>

                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    <Button onClick={() => navigate(`/admin/company/${c.cno}`)} variant="outlined" sx={{ color: '#12b886', borderColor: '#12b886' }}>상세</Button>
                                    <Button disabled variant="outlined" color="danger">삭제</Button>
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* 페이지네이션 + 범위 */}
            <Box sx={{ mt: 3 }}>
                <CustomPagination
                    page={page}
                    setPage={setPage}
                    totalPages={pageCount}
                    perPage={perPage}
                    setPerPage={setPerPage}
                />
                <Typography level="body-sm" sx={{ mt: 1, textAlign: 'center', color: 'text.secondary' }}>
                    {from}–{to} of {filtered.length}개
                </Typography>
            </Box>

            <Modal open={openImg} onClose={() => setOpenImg(false)}>
                <ModalDialog>
                    <ModalClose />
                    <DialogTitle>썸네일 미리보기</DialogTitle>
                    <DialogContent>
                        <img src={previewImg} alt="preview" style={{ width: '100%', borderRadius: 8 }} />
                    </DialogContent>
                </ModalDialog>
            </Modal>
        </Box>
    );
}