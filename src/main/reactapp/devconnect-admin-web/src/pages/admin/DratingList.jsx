// =======================================================================================
// DratingList.jsx | rw 25-05-03 최종 생성
// [설명]
// - 개발자 평가 목록 전체 조회 화면
// - ✅ 점수 / ✅ 상태 뱃지 / ✅ 제목 검색 / ✅ 정렬 / ✅ 필터 / ✅ 페이지네이션 포함
// =======================================================================================

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, Divider,
    Select, Option, Input, Button
} from '@mui/joy';
import { getDratingList } from '../../api/dratingApi';
import StatusBadge from '../../components/StatusBadge';

export default function DratingList() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('createAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const perPage = 9;

    // ✅ 데이터 불러오기
    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getDratingList(token, { page: 1, size: 100 });
                setList(res.data.content);
            } catch (err) {
                alert('개발자 평가 조회 실패');
            }
        };
        fetch();
    }, []);

    // ✅ 필터링 + 정렬 + 검색
    const filtered = useMemo(() => {
        return [...list]
            .filter(d => d.dtitle.includes(search) || d.dcontent.includes(search))
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
            <Typography level="h3" sx={{ mb: 2 }}>📝 개발자 평가 목록</Typography>

            {/* 검색 / 정렬 */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Input placeholder="제목, 내용 검색" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1 }} />
                <Select value={sortKey} onChange={(e, val) => setSortKey(val)}>
                    <Option value="createAt">등록일</Option>
                    <Option value="drscore">점수</Option>
                </Select>
                <Select value={sortOrder} onChange={(e, val) => setSortOrder(val)}>
                    <Option value="desc">내림차순</Option>
                    <Option value="asc">오름차순</Option>
                </Select>
            </Box>

            {/* 목록 카드 */}
            <Grid container spacing={2}>
                {paged.map((d) => (
                    <Grid key={d.drno} xs={12} sm={6} md={4}>
                        <Card variant="outlined">
                            <Typography level="title-md" sx={{ mb: 1 }}>{d.dtitle}</Typography>
                            <Divider />
                            <Box sx={{ mt: 1 }}>
                                <p><strong>점수:</strong> {d.drscore}점</p>
                                <p><strong>상태:</strong> <StatusBadge code={d.drstate} type="drating" /></p>
                                <p><strong>등록일:</strong> {d.createAt?.split('T')[0]}</p>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button size="sm" variant="outlined" onClick={() => navigate(`/admin/drating/${d.drno}`)}>상세/수정</Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* 페이지네이션 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Typography level="body-sm">{page} / {pageCount} 페이지</Typography>
            </Box>
        </Box>
    );
} // end
