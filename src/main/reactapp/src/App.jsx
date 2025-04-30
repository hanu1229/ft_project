// App.jsx | rw 25-04-30
// [설명] 관리자 기능을 담당하는 전체 라우팅 구성 파일입니다.
//        - 로그인 여부에 따라 페이지 접근을 제한하고
//        - 보호된 관리자 전용 페이지는 PrivateRoute로 감쌉니다.

// =======================================================================================
// [1] React Router 관련 라이브러리 import
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// =======================================================================================
// [2] 개별 화면 컴포넌트 import
import AdminLogin from "./pages/AdminLogin";               // 관리자 로그인
import AdminSignup from "./pages/AdminSignup";             // 관리자 회원가입
import AdminDashboard from "./pages/AdminDashboard";       // 관리자 대시보드 (내정보)
import AdminList from "./pages/AdminList";                 // 전체 관리자 목록
import AdminUpdate from "./pages/AdminUpdate";             // 관리자 정보 수정

// =======================================================================================
// [3] 라우트 보호용 컴포넌트 import
import PrivateRoute from "./routes/PrivateRoute";          // 로그인 인증 필터링

// =======================================================================================
// [4] JWT 토큰 유틸 import
import { getToken } from "./utils/tokenUtil";              // 로그인 여부 확인용

// =======================================================================================
// [5] App 라우팅 정의
export default function App() {
    const token = getToken(); // v 현재 로그인된 토큰 값 불러오기

    return (
        <BrowserRouter>
            <Routes>

                {/* [A] 루트 URL 접근 시: 토큰 유무에 따라 자동 리디렉션 */}
                <Route path="/" element={
                    token
                        ? <Navigate to="/admin/dashboard" />        // 로그인 상태 → 대시보드
                        : <Navigate to="/admin/login" />            // 비로그인 상태 → 로그인 페이지
                } />

                {/* [B] 로그인, 회원가입 페이지는 누구나 접근 가능 */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/signup" element={<AdminSignup />} />

                {/* [C] 아래 경로들은 로그인된 사용자만 접근 가능 (PrivateRoute로 보호) */}

                {/* [C-1] 대시보드 (내 정보) */}
                <Route path="/admin/dashboard" element={
                    <PrivateRoute>
                        <AdminDashboard />
                    </PrivateRoute>
                } />

                {/* [C-2] 전체 관리자 목록 */}
                <Route path="/admin/list" element={
                    <PrivateRoute>
                        <AdminList />
                    </PrivateRoute>
                } />

                {/* [C-3] 관리자 정보 수정 */}
                <Route path="/admin/update" element={
                    <PrivateRoute>
                        <AdminUpdate />
                    </PrivateRoute>
                } />

            </Routes>
        </BrowserRouter>
    );
}