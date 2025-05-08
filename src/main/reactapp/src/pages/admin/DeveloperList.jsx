// =======================================================================================
// DeveloperList.jsx | rw 25-05-08 리팩토링 - 공통 컴포넌트 적용
// [설명]
// - 관리자 전용 개발자 목록 페이지
// - 필터 + 검색 + 삭제 + 상세 이동 포함
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getDeveloperList,
    deleteDeveloper
} from '../../api/developerApi';
import FilterSearchBar from '../../components/FilterSearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import EntityCard from '../../components/EntityCard';

import { Box, Typography, Grid } from '@mui/joy';

export default function DeveloperList() {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const [list, setList] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [open, setOpen] = useState(false);

    // =======================================================================================
    // ✅ 목록 불러오기
    // =======================================================================================
    useEffect(() => {
        const fetchList = async () => {
            try {
                const res = await getDeveloperList(token);
                setList(res.data || []);
            } catch (err) {
                console.error(err);
                alert('개발자 목록 조회 실패');
            }
        };
        fetchList();
    }, [token]);

    // =======================================================================================
    // ✅ 필터 및 검색 적용된 목록 필터링
    // =======================================================================================
    const filteredList = list.filter((item) => {
        const matchesFilter = filter === 'all' || String(item.dstate) === filter;
        const matchesSearch =
            item.dname?.includes(search) || item.demail?.includes(search);
        return matchesFilter && matchesSearch;
    });

    // =======================================================================================
    // ✅ 삭제 처리
    // =======================================================================================
    const handleDelete = async () => {
        try {
            const res = await deleteDeveloper(token, deleteTarget);
            if (res.data) {
                setList((prev) => prev.filter((d) => d.dno !== deleteTarget));
                setOpen(false);
                setDeleteTarget(null);
            }
        } catch (err) {
            alert('삭제 실패');
        }
    };

    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#fff' }}>
            <Typography level="h3" sx={{ mb: 3, color: '#087f5b', fontWeight: 'bold' }}>
                👨‍💻 개발자 목록
            </Typography>

            <FilterSearchBar
                filter={filter}
                setFilter={setFilter}
                search={search}
                setSearch={setSearch}
                filterOptions={[
                    { value: 'all', label: '전체' },
                    { value: '0', label: '대기' },
                    { value: '1', label: '승인' },
                    { value: '9', label: '삭제' },
                ]}
            />

            <Grid container spacing={2}>
                {filteredList.map((dev) => (
                    <Grid key={dev.dno} xs={12} md={6} lg={4}>
                        <EntityCard
                            title={`개발자번호: ${dev.dno}`}
                            statusCode={dev.dstate}
                            statusType="developer"
                            info={[
                                { label: '이름', value: dev.dname },
                                { label: '이메일', value: dev.demail },
                                { label: '전화번호', value: dev.dphone },
                            ]}
                            onDetail={() => navigate(`/admin/developer/${dev.dno}`)}
                            onDelete={() => {
                                setDeleteTarget(dev.dno);
                                setOpen(true);
                            }}
                        />
                    </Grid>
                ))}
            </Grid>

            <ConfirmDeleteModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDelete}
            />
        </Box>
    );
}
