// PrivateRoute.jsx | rw 25-04-30
// [설명] 로그인된 관리자만 접근 가능한 페이지를 보호하는 컴포넌트입니다.
//        JWT 토큰이 없을 경우 로그인 페이지로 강제 이동시킵니다.

import { Navigate } from "react-router-dom";         // [1] 페이지 이동 컴포넌트
import { getToken } from "../utils/tokenUtil";       // [2] 로컬스토리지에서 JWT 토큰 가져오기

// =======================================================================================
// [1] children: 감싸고 있는 하위 컴포넌트(예: <AdminDashboard /> 등)
export default function PrivateRoute({ children }) {
    const token = getToken();                        // [A] JWT 토큰 가져오기

    // [B] 토큰이 존재하면 children(원래 가려던 컴포넌트) 반환, 없으면 로그인 페이지로 이동
    return token ? children : <Navigate to="/admin/login" />;
}