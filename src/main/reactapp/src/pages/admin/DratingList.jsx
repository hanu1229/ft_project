// =======================================================================================
// DratingList.jsx | rw 25-05-08 리팩토링 - 공통 컴포넌트 기반 적용
// [설명] 관리자 전용 개발자 평가 리스트 화면 (검색 + 상태필터 + 삭제)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDratingList, deleteDrating } from '../../api/dratingApi';
import FilterSearchBar from '../../components/FilterSearchBar';
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal';
import EntityCard from '../../components/EntityCard';

export default function DratingList() {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [open, setOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const token = localStorage.getItem('token');

    // ✅ 목록 조회
    const fetchList = async () => {
        try {
            const res = await getDratingList(token, {
                page: 0,
                size: 100,
                keyword: search
            });
            setList(res.data.content || []);
        } catch (err) {
            console.error('개발자 평가 조회 실패', err);
            alert('❗ 평가 조회 실패');
        }
    };

    useEffect(() => {
        fetchList();
    }, [search]);

    // ✅ 삭제 실행
    const handleDelete = async () => {
        try {
            const res = await deleteDrating(token, deleteTarget);
            if (res.data) {
                setList((prev) => prev.filter(item => item.drno !== deleteTarget));
                setOpen(false);
            }
        } catch (err) {
            alert('❗ 삭제 실패');
        }
    };

    // ✅ 필터링된 리스트
    const filteredList = list.filter(item =>
        filter === 'all' ? true : item.drstate.toString() === filter
    );

    return (
        <div>
            <h2 style={{ color: '#087f5b', fontWeight: 'bold', marginBottom: 16 }}>⭐ 개발자 평가 목록</h2>

            <FilterSearchBar
                filter={filter}
                setFilter={setFilter}
                search={search}
                setSearch={setSearch}
                filterOptions={[
                    { value: 'all', label: '전체' },
                    { value: '0', label: '승인대기' },
                    { value: '1', label: '승인완료' },
                    { value: '2', label: '반려' }
                ]}
            />

            {/* ✅ 리스트 렌더링 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                {filteredList.map(item => (
                    <EntityCard
                        key={item.drno}
                        title={`평가번호: ${item.drno}`}
                        fields={[
                            { label: '개발자번호', value: item.dno },
                            { label: '프로젝트번호', value: item.pno },
                            { label: '점수', value: item.drscore },
                        ]}
                        statusCode={item.drstate}
                        statusType="rating"
                        onDetailClick={() => navigate(`/admin/drating/${item.drno}`)}
                        onDeleteClick={() => {
                            setDeleteTarget(item.drno);
                            setOpen(true);
                        }}
                    />
                ))}
            </div>

            {/* ✅ 삭제 확인 모달 */}
            <ConfirmDeleteModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDelete}
            />
        </div>
    );
}
