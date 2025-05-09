// =======================================================================================
// FilterSearchBar.jsx | rw 25-05-08 최종 생성
// [설명]
// - 상태코드 필터 + 키워드 검색 입력 컴포넌트
// - CompanyList, DeveloperList 등 리스트 화면에서 공통 사용 가능
// - Joy UI 기반, ChatGPT 스타일 (절제된 컬러)
// =======================================================================================

import React from 'react';
import { Box, Input, Select, Option } from '@mui/joy';

/**
 * 상태 필터 + 키워드 검색 바
 * @param {object} props
 * @param {string} filter - 현재 선택된 상태 코드 값
 * @param {function} setFilter - 상태 변경 함수
 * @param {string} search - 현재 검색어
 * @param {function} setSearch - 검색어 변경 함수
 * @param {object[]} options - 필터 옵션 (예: [{value: '0', label: '대기'}])
 */
export default function FilterSearchBar({
                                            filter,
                                            setFilter,
                                            search,
                                            setSearch,
                                            options = [
                                                { value: 'all', label: '전체' },
                                                { value: '0', label: '대기' },
                                                { value: '1', label: '승인' },
                                                { value: '9', label: '삭제' }
                                            ]
                                        }) {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            {/* ✅ 상태 필터 */}
            <Select
                value={filter}
                onChange={(e, val) => setFilter(val)}
                sx={{ minWidth: 120 }}
                variant="soft"
            >
                {options.map(opt => (
                    <Option key={opt.value} value={opt.value}>
                        {opt.label}
                    </Option>
                ))}
            </Select>

            {/* ✅ 키워드 검색 */}
            <Input
                placeholder="이름, 이메일 등 검색"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                variant="soft"
                sx={{ flex: 1 }}
            />
        </Box>
    );
}