// =======================================================================================
// StatusBadge.jsx | rw 25-05-08 리팩토링 - projectJoin 타입 추가 반영
// =======================================================================================

import React from 'react';
import Chip from '@mui/joy/Chip';

/**
 * 상태코드에 따라 텍스트와 색상을 반환하는 뱃지
 * @param {number} code - 상태 코드 (0, 1, 2, ...)
 * @param {string} type - 상태 타입 (admin | company | developer | project | projectJoin)
 * @returns JSX.Element
 */
export default function StatusBadge({ code, type = 'admin' }) {
    let label = '기타';
    let color = 'neutral';

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
        projectJoin: {
            label: ['승인대기', '승인완료', '반려'],
            color: ['warning', 'success', 'danger'],
        },
    };

    const status = statusMap[type];
    if (status) {
        label = status.label[code] ?? `상태 ${code}`;
        color = status.color[code] ?? 'neutral';
    }

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