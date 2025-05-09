// =======================================================================================
// EntityCard.jsx | rw 25-05-08 공통 카드 컴포넌트
// [설명]
// - 관리자 전용 목록 화면에서 재사용 가능한 카드 컴포넌트
// - 각 도메인(List)의 1개 항목 단위 출력에 공통 사용
// - bgColor, borderColor 등은 props로 커스터마이징 가능
// =======================================================================================

import React from 'react';
import {
    Card,
    Typography,
    Box,
    Divider,
    Button
} from '@mui/joy';

export default function EntityCard({
                                       title,
                                       info = [],
                                       id,
                                       expandedId,
                                       onToggle,
                                       onDelete,
                                       onDetail,
                                       bgColor = '#f8f9fa',
                                       borderColor = '#12b886'
                                   }) {
    const isExpanded = expandedId === id;

    return (
        <Card
            variant="outlined"
            sx={{
                bgcolor: bgColor,
                borderColor: borderColor,
                '&:hover': {
                    boxShadow: '0 0 12px rgba(18, 184, 134, 0.3)'
                }
            }}
        >
            {/* ✅ 제목 */}
            <Typography level="title-md" sx={{ color: borderColor }}>
                {title}
            </Typography>

            <Divider sx={{ my: 1, borderColor: '#ced4da' }} />

            {/* ✅ 기본 정보 출력 */}
            <Box sx={{ fontSize: 14 }}>
                {info.map((item, index) => (
                    <p key={index}><strong>{item.label}</strong> {item.value}</p>
                ))}
            </Box>

            {/* ✅ 확장 버튼 */}
            {isExpanded ? (
                <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Button color="neutral" onClick={() => onToggle(null)}>닫기</Button>
                    <Button color="danger" variant="solid" onClick={onDelete}>삭제</Button>
                    <Button color="success" onClick={onDetail}>수정 / 상세</Button>
                </Box>
            ) : (
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="outlined"
                        size="sm"
                        onClick={() => onToggle(id)}
                        sx={{
                            borderColor: borderColor,
                            color: borderColor,
                            fontWeight: 500,
                            '&:hover': {
                                bgcolor: borderColor,
                                color: '#fff'
                            }
                        }}
                    >
                        상세보기
                    </Button>
                </Box>
            )}
        </Card>
    );
}