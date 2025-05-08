// =======================================================================================
// CratingList.jsx | rw 25-05-08 리팩토링 - 공통 컴포넌트 적용
// [설명] 관리자 전용 기업 평가 리스트 페이지 (검색 + 상태 필터링 + 삭제 + 상세이동)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getCratingList,
    deleteCrating
} from '../../api/cratingApi.js';

import FilterSearchBar from '../../components/FilterSearchBar.jsx';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal.jsx';
import EntityCard from '../../components/EntityCard.jsx';

import { Box, Typography, Grid } from '@mui/joy';

export default function CratingList() {
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [target, setTarget] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchList = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getCratingList(token, {
                    page: 0,
                    size: 100,
                    keyword: search
                });
                let rows = res.data.content || [];
                if (filter !== 'all') rows = rows.filter((c) => c.crstate == filter);
                setList(rows);
            } catch (err) {
                alert('❗ 기업평가 목록 조회 실패');
                console.error(err);
            }
        };
        fetchList();
    }, [filter, search]);

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await deleteCrating(token, target);
            if (res.data) {
                setList((prev) => prev.filter((c) => c.crno !== target));
                setOpen(false);
                setTarget(null);
            }
        } catch (err) {
            alert('❗ 삭제 실패');
            console.error(err);
        }
    };

    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#ffffff' }}>
            <Typography level="h3" sx={{ mb: 3, color: '#364fc7', fontWeight: 'bold' }}>
                🏢 기업 평가 목록
            </Typography>

            {/* ✅ 필터 + 검색바 */}
            <FilterSearchBar
                filter={filter}
                setFilter={setFilter}
                search={search}
                setSearch={setSearch}
                type="rating"
            />

            {/* ✅ 리스트 카드 */}
            <Grid container spacing={2}>
                {list.map((cr) => (
                    <EntityCard
                        key={cr.crno}
                        title={`평가번호: ${cr.crno}`}
                        items={[
                            { label: '기업번호', value: cr.cno },
                            { label: '개발자번호', value: cr.dno },
                            { label: '점수', value: cr.crscore }
                        ]}
                        status={{ code: cr.crstate, type: 'rating' }}
                        onDetail={() => navigate(`/admin/crating/${cr.crno}`)}
                        onDelete={() => {
                            setTarget(cr.crno);
                            setOpen(true);
                        }}
                    />
                ))}
            </Grid>

            {/* ✅ 삭제 확인 모달 */}
            <ConfirmDeleteModal
                open={open}
                setOpen={setOpen}
                onConfirm={handleDelete}
            />
        </Box>
    );
}
