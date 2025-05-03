// =======================================================================================
// CustomPagination.jsx | rw 25-05-03 최종 수정
// [설명] MUI Joy Pagination 대체용 커스텀 페이지네이션 컴포넌트
//        - props: page, setPage, totalPages, perPage, setPerPage
// =======================================================================================

import React from 'react';
import { Box, Select, Option, IconButton, Typography } from '@mui/joy';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CustomPagination = ({ page, setPage, totalPages, perPage, setPerPage }) => {
    const handlePrev = () => {
        if (page > 1) setPage(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) setPage(page + 1);
    };

    return (
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* 이전/다음 버튼 */}
            <Box>
                <IconButton onClick={handlePrev} disabled={page === 1}><ChevronLeft /></IconButton>
                <Typography level="body-sm" sx={{ mx: 1 }}>
                    {page} / {totalPages}
                </Typography>
                <IconButton onClick={handleNext} disabled={page === totalPages}><ChevronRight /></IconButton>
            </Box>

            {/* 페이지당 항목 수 설정 */}
            <Box>
                <Select value={perPage} onChange={(e, val) => setPerPage(val)} size="sm">
                    <Option value={6}>6개씩</Option>
                    <Option value={9}>9개씩</Option>
                    <Option value={12}>12개씩</Option>
                </Select>
            </Box>
        </Box>
    );
};

export default CustomPagination;