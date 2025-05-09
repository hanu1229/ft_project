// =======================================================================================
// CompanyList.jsx | rw 25-05-08 공통 컴포넌트 적용 리팩토링
// [설명] 기업 목록 화면 - 필터 + 검색 + 카드형 목록 + 삭제 모달 구성 (관리자 전용)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import {
    getCompanyList,
    deleteCompanyState
} from '../../api/companyApi'; // ✅ 관리자 직권 기준 API 적용
import FilterSearchBar from '../../components/FilterSearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import EntityCard from '../../components/EntityCard';
import { Box, Typography } from '@mui/joy';

export default function CompanyList() {
    const [list, setList] = useState([]);                   // ✅ 전체 기업 목록
    const [filter, setFilter] = useState('all');           // ✅ 상태 필터
    const [search, setSearch] = useState('');              // ✅ 검색어 상태
    const [open, setOpen] = useState(false);               // ✅ 삭제 모달 상태
    const [targetId, setTargetId] = useState(null);        // ✅ 삭제 대상 기업 번호

    // =======================================================================================
    // ✅ 기업 목록 조회 함수
    // =======================================================================================
    const fetchList = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await getCompanyList(token, { page: 0, size: 100 });
            setList(res.data.content || []);
        } catch (err) {
            alert('❗ 기업 목록 조회 실패');
            console.error(err);
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    // =======================================================================================
    // ✅ 기업 삭제 요청 함수
    // =======================================================================================
    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await deleteCompanyState(token, { cno: targetId });
            if (res.data) {
                setList(prev => prev.filter(c => c.cno !== targetId));
                setOpen(false);
                setTargetId(null);
            }
        } catch (err) {
            alert('❗ 삭제 실패');
            console.error(err);
        }
    };

    // =======================================================================================
    // ✅ 필터 + 검색 적용된 목록 필터링
    // =======================================================================================
    const filteredList = list.filter(company => {
        const matchState = filter === 'all' || company.cstate.toString() === filter;
        const matchKeyword =
            company.cname.includes(search) ||
            company.cemail.includes(search) ||
            company.cphone.includes(search);
        return matchState && matchKeyword;
    });

    // =======================================================================================
    // ✅ 렌더링
    // =======================================================================================
    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#fff' }}>
            <Typography level="h3" sx={{ mb: 3, color: '#087f5b', fontWeight: 'bold' }}>
                🏢 기업 목록
            </Typography>

            {/* ✅ 필터 + 검색 바 */}
            <FilterSearchBar
                filter={filter}
                setFilter={setFilter}
                search={search}
                setSearch={setSearch}
                type="company"
            />

            {/* ✅ 기업 카드 목록 */}
            {filteredList.map(company => (
                <EntityCard
                    key={company.cno}
                    id={company.cno}
                    title={company.cname}
                    subtitle={company.cemail}
                    status={company.cstate}
                    type="company"
                    onEdit={() => window.location.href = `/admin/company/${company.cno}`}
                    onDelete={() => {
                        setTargetId(company.cno);
                        setOpen(true);
                    }}
                />
            ))}

            {/* ✅ 삭제 확인 모달 */}
            <ConfirmDeleteModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDelete}
                targetLabel="기업"
            />
        </Box>
    );
}
