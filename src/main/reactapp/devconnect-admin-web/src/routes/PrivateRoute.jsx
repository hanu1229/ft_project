// PrivateRoute.jsx | rw 25-05-01
// [설명] 로그인된 관리자만 접근 가능한 보호 라우터 컴포넌트
//        - 로컬스토리지에 저장된 JWT 토큰 존재 여부 확인
//        - 없을 경우 로그인 페이지로 강제 이동

import React from 'react';
import { Navigate } from 'react-router-dom';

// ✅ 자식 컴포넌트를 받아서 토큰 여부에 따라 조건부 렌더링
export default function PrivateRoute({ children }) {
    const token = localStorage.getItem('token'); // [1] 토큰 존재 여부 확인

    if (!token) {
        // [2] 토큰 없으면 로그인 페이지로 리다이렉트
        return <Navigate to="/admin/login" replace />;
    }

    // [3] 토큰이 존재하면 자식 컴포넌트 렌더링
    return children;
}