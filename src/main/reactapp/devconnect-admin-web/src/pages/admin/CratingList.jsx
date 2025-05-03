// =======================================================================================
// CratingList.jsx | rw 25-05-03 최종본 (Pagination 제거, CustomPagination 연동)
// [설명]
// - 기업 평가 목록 전체 조회 화면
// - ✅ 상태 뱃지 / ✅ 점수 / ✅ 제목 / ✅ 정렬 / ✅ 필터 / ✅ 검색 / ✅ 페이지네이션
// =======================================================================================

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, Divider,
    Select, Option, Input, Button
} from '@mui/joy';
import { getCratingList } from '../../api/cratingApi';
import StatusBadge from '../../components/StatusBadge';
import CustomPagination from '../../components/CustomPagination'; // ✅ 교체된 페이지네이션

export default function CratingList() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('createAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(9); // ✅ 유동적 페이지당 항목 수

    // ✅ 1. 전체 데이터 불러오기
    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getCratingList(token, { page: 1, size: 100 }); // 전체 조회
                setList(res.data.content);
            } catch (err) {
                alert('기업 평가 조회 실패');
            }
        };
        fetch();
    }, []);

    // ✅ 2. 필터 + 정렬 + 검색 적용
    const filtered = useMemo(() => {
        return [...list]
            .filter(c =>
                c.ctitle.includes(search) || c.ccontent.includes(search)
            )
            .sort((a, b) => {
                const aVal = a[sortKey];
                const bVal = b[sortKey];
                return sortOrder === 'asc'
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
            });
    }, [list, search, sortKey, sortOrder]);

    const paged = filtered.slice((page - 1) * perPage, page * perPage);
    const pageCount = Math.ceil(filtered.length / perPage);

    return (
        <Box sx={{ px: 3, py: 3 }}>
            <Typography level="h3" sx={{ mb: 2 }}>📄 기업 평가 목록</Typography>

            {/* ✅ 검색 / 정렬 옵션 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Input
                    placeholder="제목, 내용 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    sx={{ flex: 1 }}
                />
                <Select value={sortKey} onChange={(e, val) => setSortKey(val)}>
                    <Option value="createAt">등록일</Option>
                    <Option value="crscore">점수</Option>
                </Select>
                <Select value={sortOrder} onChange={(e, val) => setSortOrder(val)}>
                    <Option value="desc">내림차순</Option>
                    <Option value="asc">오름차순</Option>
                </Select>
            </Box>

            {/* ✅ 목록 카드 표시 */}
            <Grid container spacing={2}>
                {paged.map((c) => (
                    <Grid key={c.crno} xs={12} sm={6} md={4}>
                        <Card variant="outlined">
                            <Typography level="title-md" sx={{ mb: 1 }}>{c.ctitle}</Typography>
                            <Divider />
                            <Box sx={{ mt: 1 }}>
                                <p><strong>점수:</strong> {c.crscore}점</p>
                                <p><strong>상태:</strong> <StatusBadge code={c.crstate} type="crating" /></p>
                                <p><strong>등록일:</strong> {c.createAt?.split('T')[0]}</p>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button
                                    size="sm"
                                    variant="outlined"
                                    onClick={() => navigate(`/admin/crating/${c.crno}`)}
                                >
                                    상세/수정
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ✅ 커스텀 페이지네이션 적용 */}
            <CustomPagination
                page={page}
                setPage={setPage}
                totalPages={pageCount}
                perPage={perPage}
                setPerPage={setPerPage}
            />
        </Box>
    );
}