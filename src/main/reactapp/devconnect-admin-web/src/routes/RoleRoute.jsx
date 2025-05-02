// =======================================================================================
// RoleRoute.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 권한 보호 라우터
// - JWT 토큰이 존재하고, role 또는 adtype 값이 'Admin'일 때만 접근 허용
// - 조건 불충족 시 Forbidden 또는 Login 페이지로 리디렉션
// =======================================================================================

import React from 'react';
import { Navigate } from 'react-router-dom';   // ✅ 조건 미충족 시 리디렉션 처리
import { jwtDecode } from 'jwt-decode';        // ✅ JWT 토큰 디코딩용

/**
 * RoleRoute 컴포넌트
 * - 관리자 전용 기능 보호 라우터
 * - 유효한 JWT + 관리자 권한(role === 'Admin')이 있어야 접근 허용
 *
 * @param {JSX.Element} children - 보호하고자 하는 컴포넌트
 * @returns {JSX.Element} - 조건에 따라 children 또는 Navigate 리턴
 */
export default function RoleRoute({ children }) {
    const token = localStorage.getItem('token'); // ✅ 토큰 확인

    // ✅ [1] 토큰 없음 → 로그인 페이지로 이동
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    try {
        // ✅ [2] 토큰 디코딩 후 역할 확인
        const decoded = jwtDecode(token);
        const role = decoded?.role || decoded?.adtype;

        // ✅ [3] 관리자 권한이 아닌 경우 → 접근 금지 페이지로 이동
        if (role !== 'Admin') {
            return <Navigate to="/admin/forbidden" replace />;
        }

        // ✅ [4] 관리자 권한 확인 완료 → 자식 컴포넌트 렌더링 허용
        return children;

    } catch (err) {
        // ✅ [5] 토큰 디코딩 실패 → 로그인 페이지로 이동
        console.error('JWT 디코딩 실패:', err);
        return <Navigate to="/admin/login" replace />;
    }
}