// =======================================================================================
// RoleRoute.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 권한 보호 라우터
// - JWT 토큰 존재 + role === 'Admin' 일 때만 접근 허용
// - 조건 불충족 시 Forbidden 또는 Login 페이지로 리디렉션
// =======================================================================================

import React from 'react';
import { Navigate } from 'react-router-dom';       // ✅ 라우팅 전환용
import { jwtDecode } from 'jwt-decode';            // ✅ JWT 디코더

/**
 * 관리자 권한 보호 라우팅
 * @param {Object} props
 * @param {JSX.Element} props.children - 보호할 컴포넌트
 * @returns {JSX.Element}
 */
export default function RoleRoute({ children }) {
    const token = localStorage.getItem('token');   // ✅ 저장된 JWT 토큰 확인

    // [1] 토큰 없음 → 로그인 페이지로 이동
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    try {
        // [2] JWT 디코딩 → 관리자 권한 확인
        const decoded = jwtDecode(token);
        const role = decoded?.role ?? decoded?.adtype;

        // [3] 관리자 아님 → 접근 차단 페이지로 이동
        if (role !== 'Admin') {
            return <Navigate to="/admin/forbidden" replace />;
        }

        // [4] 관리자 권한 확인 성공 → 컴포넌트 렌더링 허용
        return children;

    } catch (err) {
        // [5] 디코딩 실패 → 로그인 페이지 이동
        console.error('JWT 디코딩 실패:', err);
        return <Navigate to="/admin/login" replace />;
    }
}