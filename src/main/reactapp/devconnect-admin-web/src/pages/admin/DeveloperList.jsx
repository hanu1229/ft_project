// =======================================================================================
// DeveloperList.jsx | rw 25-05-03 최종 생성
// [설명]
// - 전체 개발자 목록 조회 화면
// - ✅ 상태 뱃지 / ✅ 썸네일 / ✅ 정렬 / ✅ 검색 / ✅ 페이지네이션 포함
// =======================================================================================

import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box, Typography, Grid, Card, Divider,
    Select, Option, Input, Button
} from '@mui/joy';
import { getDeveloperList } from '../../api/developerApi';
import StatusBadge from '../../components/StatusBadge';

export default function DeveloperList() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState('dlevel');
    const [sortOrder, setSortOrder] = useState('desc');
    const [page, setPage] = useState(1);
    const perPage = 9;

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getDeveloperList();
                setList(res.data);
            } catch (err) {
                alert('개발자 목록 조회 실패');
            }
        };
        fetch();
    }, []);

    const filtered = useMemo(() => {
        return [...list]
            .filter(d =>
                d.dname.includes(search) ||
                d.did.includes(search) ||
                d.demail.includes(search)
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
            <Typography level="h3" sx={{ mb: 2 }}>👩‍💻 개발자 목록</Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                <Input placeholder="이름, 이메일, 아이디 검색" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ flex: 1 }} />
                <Select value={sortKey} onChange={(e, val) => setSortKey(val)}>
                    <Option value="dlevel">레벨</Option>
                    <Option value="dtotalExp">총경험치</Option>
                    <Option value="createAt">가입일</Option>
                </Select>
                <Select value={sortOrder} onChange={(e, val) => setSortOrder(val)}>
                    <Option value="desc">내림차순</Option>
                    <Option value="asc">오름차순</Option>
                </Select>
            </Box>

            <Grid container spacing={2}>
                {paged.map((d) => (
                    <Grid key={d.dno} xs={12} sm={6} md={4}>
                        <Card variant="outlined">
                            <Typography level="title-md" sx={{ mb: 1 }}>{d.dname} ({d.did})</Typography>
                            <Divider />
                            <Box sx={{ mt: 1 }}>
                                <img
                                    src={`/profile/${d.dprofile}`}
                                    alt="프로필"
                                    width={60}
                                    style={{ borderRadius: '50%' }}
                                />
                                <p><strong>레벨:</strong> {d.dlevel}</p>
                                <p><strong>경험치:</strong> {d.dcurrentExp} / {d.dtotalExp}</p>
                                <p><strong>상태:</strong> <StatusBadge code={d.dstate ? 1 : 0} type="developer" /></p>
                                <p><strong>가입일:</strong> {d.createAt?.split('T')[0]}</p>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                <Button size="sm" variant="outlined" onClick={() => navigate(`/admin/developer/${d.dno}`)}>상세</Button>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Typography level="body-sm">{page} / {pageCount} 페이지</Typography>
            </Box>
        </Box>
    );
}
