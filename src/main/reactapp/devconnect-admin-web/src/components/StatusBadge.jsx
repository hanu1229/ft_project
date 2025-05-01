// StatusBadge.jsx | rw 25-05-01
// [설명] 관리자 페이지에서 사용하는 상태 코드 시각화 뱃지 컴포넌트

import React from 'react';
import Chip from '@mui/joy/Chip';

export default function StatusBadge({ code, type = 'admin' }) {
    let label = '';
    let color = 'neutral';

    switch (type) {
        case 'admin':
            label = ['신청', '승인', '반려', '삭제'][code] || '기타';
            color = ['warning', 'success', 'danger', 'neutral'][code] || 'neutral';
            break;
        case 'company':
            label = ['대기', '활성', '중지'][code] || '기타';
            color = ['warning', 'success', 'danger'][code] || 'neutral';
            break;
        case 'project':
            label = ['모집중', '진행중', '종료'][code] || '기타';
            color = ['primary', 'info', 'neutral'][code] || 'neutral';
            break;
        default:
            label = `상태 ${code}`;
    }

    return <Chip color={color} variant="soft" size="sm" sx={{ fontWeight: 'bold' }}>{label}</Chip>;
}
