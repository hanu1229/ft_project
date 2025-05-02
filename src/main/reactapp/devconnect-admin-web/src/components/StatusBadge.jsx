// StatusBadge.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 페이지 전용 상태코드 뱃지 컴포넌트
//        - admin / company / project 상태 구분 렌더링
//        - Joy UI <Chip> 컴포넌트 기반 상태값 시각화
//        - 블랙 기반 UI에 최적화된 soft 배경 및 색상 구성

import React from 'react';
import Chip from '@mui/joy/Chip'; // ✅ Joy UI Chip 컴포넌트 (상태 뱃지용)

/**
 * 상태 코드와 타입에 따라 텍스트 및 색상을 반환하는 뱃지 컴포넌트
 * @param {number} code - 상태코드 (0, 1, 2, ...)
 * @param {string} type - 상태 타입 (admin | company | project)
 * @returns JSX.Element
 */
export default function StatusBadge({ code, type = 'admin' }) {
    let label = '';        // ✅ 뱃지에 표시할 텍스트
    let color = 'neutral'; // ✅ Joy UI Chip 색상 preset

    // =======================================================================================
    // ✅ 상태코드별 텍스트/색상 매핑 처리
    // =======================================================================================
    switch (type) {
        case 'admin':
            // 0: 신청, 1: 승인, 2: 반려, 3: 삭제
            label = ['신청', '승인', '반려', '삭제'][code] || '기타';
            color = ['warning', 'success', 'danger', 'neutral'][code] || 'neutral';
            break;

        case 'company':
            // 0: 대기, 1: 활성, 2: 중지
            label = ['대기', '활성', '중지'][code] || '기타';
            color = ['warning', 'success', 'danger'][code] || 'neutral';
            break;

        case 'project':
            // 0: 모집중, 1: 진행중, 2: 종료
            label = ['모집중', '진행중', '종료'][code] || '기타';
            color = ['primary', 'info', 'neutral'][code] || 'neutral';
            break;

        default:
            label = `상태 ${code}`;
            color = 'neutral';
    }

    // =======================================================================================
    // ✅ Chip 컴포넌트로 상태 뱃지 출력
    // =======================================================================================
    return (
        <Chip
            color={color}         // [색상] 상태별 지정
            variant="soft"       // [배경] 다크테마 대응 부드러운 배경
            size="sm"            // [크기] 소형 뱃지
            sx={{
                fontWeight: 'bold',
                textTransform: 'none',
            }}
        >
            {label}
        </Chip>
    );
}