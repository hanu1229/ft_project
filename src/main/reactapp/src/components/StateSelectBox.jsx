// =======================================================================================
// StateSelectBox.jsx | rw 25-05-08 공통 상태코드 선택 컴포넌트
// [설명]
// - Detail 페이지에서 상태코드 수정용 SelectBox
// - type 에 따라 admin / developer / company / projectJoin 선택 가능
// =======================================================================================

import React from 'react';
import { Select, Option, Typography } from '@mui/joy';

/**
 * 상태코드 선택 공통 SelectBox
 * @param {number} value - 현재 선택된 상태코드
 * @param {Function} onChange - 선택 변경 핸들러
 * @param {string} type - 상태 타입 (admin | developer | company | projectJoin)
 */
export default function StateSelectBox({ value, onChange, type = 'admin' }) {
    const stateMap = {
        admin: [
            { code: 0, label: '신청' },
            { code: 1, label: '승인' },
            { code: 2, label: '반려' },
            { code: 9, label: '삭제' },
        ],
        developer: [
            { code: 0, label: '대기' },
            { code: 1, label: '승인' },
            { code: 9, label: '삭제' },
        ],
        company: [
            { code: 0, label: '대기' },
            { code: 1, label: '활성' },
            { code: 2, label: '중지' },
            { code: 9, label: '삭제' },
        ],
        projectJoin: [
            { code: 0, label: '승인대기' },
            { code: 1, label: '승인완료' },
            { code: 2, label: '반려' },
        ]
    };

    const options = stateMap[type] || [];

    return (
        <div>
            <Typography level="body-sm" sx={{ mb: 1, color: '#495057' }}>
                상태코드 변경
            </Typography>
            <Select
                value={value}
                onChange={(e, val) => onChange(val)}
                sx={{ minWidth: 180 }}
            >
                {options.map((opt) => (
                    <Option key={opt.code} value={opt.code}>
                        {opt.label} ({opt.code})
                    </Option>
                ))}
            </Select>
        </div>
    );
}
