// =======================================================================================
// StatusBadge.jsx | rw 25-05-03 최종 리팩토링 v2
// [설명]
// - Joy UI 기반 상태 뱃지 표시 컴포넌트
// - 관리자 전용: admin / company / developer / project 등 타입별 코드 표시
// - prop-types 사용 + fallback 안전 처리 + 소프트톤 스타일
// =======================================================================================

import React from 'react';
import PropTypes from 'prop-types'; // ✅ prop 타입 검사용
import Chip from '@mui/joy/Chip';

/**
 * 상태코드에 따라 텍스트와 색상을 반환하는 뱃지
 * @param {number} code - 상태 코드 (0, 1, 2, ...)
 * @param {string} type - 상태 타입 (admin | company | developer | project ...)
 * @returns JSX.Element
 */
export default function StatusBadge({ code, type }) {
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
        crating: {
            label: ['미승인', '승인', '삭제'],
            color: ['warning', 'success', 'neutral'],
        },
        drating: {
            label: ['미승인', '승인', '삭제'],
            color: ['warning', 'success', 'neutral'],
        },
        projectJoin: {
            label: ['신청', '참여중', '종료'],
            color: ['primary', 'success', 'neutral'],
        },
    };

    const status = statusMap[type];

    if (!status) {
        console.warn(`[StatusBadge] 알 수 없는 type: "${type}"`);
        return null;
    }

    const label = status.label[code] ?? `상태 ${code}`;
    const color = status.color[code] ?? 'neutral';

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

// ✅ prop 타입 검사 추가
StatusBadge.propTypes = {
    code: PropTypes.number.isRequired,
    type: PropTypes.oneOf([
        'admin', 'company', 'developer', 'project',
        'crating', 'drating', 'projectJoin'
    ]).isRequired,
};