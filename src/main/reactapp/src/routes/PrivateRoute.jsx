// =======================================================================================
// PrivateRoute.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 로그인 보호 전용 라우팅 컴포넌트
// - localStorage에 JWT 토큰이 없을 경우 로그인 페이지로 강제 리디렉션
// - JWT 토큰이 존재하면 해당 children 컴포넌트 렌더링 허용
// =======================================================================================

import React from 'react';
import { Navigate } from 'react-router-dom'; // ✅ 리디렉션 처리

/**
 * 로그인 보호 라우터 (JWT 존재 여부 확인)
 * @param {Object} props
 * @param {JSX.Element} props.children - 보호할 컴포넌트
 * @returns {JSX.Element}
 */
export default function PrivateRoute({ children }) {
    const token = localStorage.getItem('accessToken'); // ✅ JWT 토큰 가져오기

    // ❌ 토큰이 없으면 로그인 화면으로 이동
    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    // ✅ 토큰이 있으면 해당 children 컴포넌트 그대로 출력
    return children;
}