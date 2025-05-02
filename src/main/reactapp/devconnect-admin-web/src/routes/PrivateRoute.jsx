// =======================================================================================
// PrivateRoute.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 로그인 보호 라우터 컴포넌트
// - localStorage에 JWT 토큰이 없으면 /admin/login 으로 리디렉션
// - 토큰이 존재하면 children 컴포넌트 그대로 렌더링
// =======================================================================================

import React from 'react';
import { Navigate } from 'react-router-dom'; // ✅ 페이지 이동용 컴포넌트

/**
 * @param {JSX.Element} children - 보호할 컴포넌트
 * @returns {JSX.Element} - 로그인 상태에 따라 children 또는 Redirect 반환
 */
export default function PrivateRoute({ children }) {
    const token = localStorage.getItem('token'); // ✅ JWT 토큰 확인

    // ❌ 토큰 없음 → 로그인 페이지로 강제 이동
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    // ✅ 토큰 있음 → 보호된 컴포넌트 렌더링 허용
    return children;
}