// RoleRoute.jsx | rw 25-05-01
// [설명] 관리자 권한 전용 보호 라우터
//        - JWT 토큰 존재 여부 + 사용자 역할(adtype 또는 role)이 "Admin"인지 확인
//        - 조건 불충족 시 로그인 또는 접근 금지 페이지로 이동

import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // ✅ 토큰 디코딩용 외부 라이브러리

export default function RoleRoute({ children }) {
    const token = localStorage.getItem('token');

    if (!token) {
        // ✅ 로그인 안 되어 있으면 로그인 페이지로 이동
        return <Navigate to="/admin/login" replace />;
    }

    try {
        // ✅ JWT 토큰 디코딩
        const decoded = jwtDecode(token); // 💡 변수명: decoded로 통일
        const role = decoded?.role || decoded?.adtype;

        if (role !== 'Admin') {
            // ✅ 관리자가 아니면 접근 금지 페이지로 이동
            return <Navigate to="/admin/forbidden" replace />;
        }

        // ✅ 관리자인 경우 해당 컴포넌트 렌더링 허용
        return children;

    } catch (err) {
        // ✅ 토큰 파싱 실패 → 로그인 페이지로 이동
        return <Navigate to="/admin/login" replace />;
    }
}