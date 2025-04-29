// [1] 라이브러리 import
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// [2] 페이지 import
import AdminLogin from "./pages/AdminLogin";
import AdminSignup from "./pages/AdminSignup";
import AdminDashboard from "./pages/AdminDashboard";
import AdminList from "./pages/AdminList";
import AdminUpdate from "./pages/AdminUpdate";


// [3] 라우트 보호용 컴포넌트 import
import PrivateRoute from "./routes/PrivateRoute";

import { getToken } from "./utils/tokenUtil";   // 추가!



// [4] App 컴포넌트 정의
export default function App() {
    const token = getToken(); // 현재 로그인된 토큰 가져오기
    return (
        <BrowserRouter>
            <Routes>

                {/* [A] 루트 접속 시 처리 - 토큰 여부에 따라 리디렉션 */}
                <Route path="/" element={token ? <Navigate to="/admin/dashboard" /> : <Navigate to="/admin/login" />} />

                {/* [B] 로그인, 회원가입 페이지 */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />

                {/* [C] 대시보드, 관리자 목록 (보호 라우트) */}
                <Route path="/admin/dashboard" element={
                    <PrivateRoute>
                        <AdminDashboard />
                    </PrivateRoute>
                } />

                <Route path="/admin/list" element={
                    <PrivateRoute>
                        <AdminList />
                    </PrivateRoute>
                } />

                <Route path="/admin/update" element={
                    <PrivateRoute>
                        <AdminUpdate />
                    </PrivateRoute>
                } />

            </Routes>
        </BrowserRouter>
    );
}