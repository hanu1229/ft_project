// =======================================================================================
// StatusBadge.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 페이지 전용 상태 뱃지 컴포넌트
// - Joy UI <Chip> 컴포넌트 기반
// - admin / company / developer / project 타입별 상태 코드 처리
// - 색상 및 텍스트는 ChatGPT.com 스타일 기반 soft 톤 반영
// =======================================================================================

import React from 'react';
import Chip from '@mui/joy/Chip'; // ✅ Joy UI Chip

/**
 * 상태코드에 따라 텍스트와 색상을 반환하는 뱃지
 * @param {number} code - 상태 코드 (0, 1, 2, ...)
 * @param {string} type - 상태 타입 (admin | company | developer | project)
 * @returns JSX.Element
 */
export default function StatusBadge({ code, type = 'admin' }) {
    let label = '기타';
    let color = 'neutral'; // ✅ Joy UI 내장 색상 preset (success, danger 등)

    // =======================================================================================
    // ✅ 타입별 상태 매핑 정의
    // =======================================================================================
    const statusMap = {
        admin: {
            label: ['신청', '승인', '반려', '퇴사'],
            color: ['warning', 'success', 'danger', 'neutral'],
        },
        company: {
            label: ['대기', '활성', '중지', '삭제'],
            color: ['warning', 'success', 'danger', 'neutral'],
        },
        developer: {
            label: ['대기', '활성', '중지', '삭제'],
            color: ['warning', 'success', 'danger', 'neutral'],
        },
        project: {
            label: ['모집중', '진행중', '종료'],
            color: ['primary', 'info', 'neutral'],
        },
    };

    // =======================================================================================
    // ✅ 실제 상태코드에 따른 텍스트/색상 설정
    // =======================================================================================
    const status = statusMap[type];
    if (status) {
        label = status.label[code] ?? `상태 ${code}`;
        color = status.color[code] ?? 'neutral';
    }

    // =======================================================================================
    // ✅ Chip 컴포넌트 렌더링 (Soft 톤)
    // =======================================================================================
    return (
        <Chip
            color={color}
            variant="soft"
            size="sm"
            sx={{
                px: 1.2,
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 'md',
                textTransform: 'none',
                letterSpacing: '0.3px',
                minWidth: '56px',
                justifyContent: 'center',
            }}
        >
            {label}
        </Chip>
    );
}