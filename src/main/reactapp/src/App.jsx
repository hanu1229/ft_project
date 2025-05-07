import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ✅ 보호 라우터
import PrivateRoute from './routes/PrivateRoute.jsx';
import RoleRoute from './routes/RoleRoute.jsx';

// ✅ 공통 레이아웃
import AdminLayout from './layouts/AdminLayout.jsx';

// ✅ 인증 관련 페이지
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminSignup from './pages/admin/AdminSignup.jsx';
import Forbidden from './pages/admin/Forbidden.jsx';

// ✅ 관리자 본인 기능
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminUpdate from './pages/admin/AdminUpdate.jsx';
import AdminList from './pages/admin/AdminList.jsx'; // 💡 관리자 목록도 포함

// ✅ 기업 관리
import CompanyList from './pages/admin/CompanyList.jsx';
import CompanyDetail from './pages/admin/CompanyDetail.jsx';

// ✅ 개발자 관리
import DeveloperList from './pages/admin/DeveloperList.jsx';
import DeveloperDetail from './pages/admin/DeveloperDetail.jsx';

// ✅ 평가 관리
import CratingList from './pages/admin/CratingList.jsx';
import CratingDetail from './pages/admin/CratingDetail.jsx';
import DratingList from './pages/admin/DratingList.jsx';
import DratingDetail from './pages/admin/DratingDetail.jsx';

// ✅ 프로젝트 관리
import ProjectList from './pages/admin/ProjectList.jsx';
import ProjectDetail from './pages/admin/ProjectDetail.jsx';

// ✅ 프로젝트 참여 관리
import ProjectJoinList from './pages/admin/ProjectJoinList.jsx';
import ProjectJoinDetail from './pages/admin/ProjectJoinDetail.jsx';

export default function App() {
    return (
        <Routes>
            {/* ✅ [0] 루트 접근 시 로그인으로 강제 이동 */}
            <Route path="/" element={<Navigate to="/admin/login" replace />} />

            {/* ✅ [1] 인증 관련 경로 (로그인 전에도 접근 허용) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />
            <Route path="/admin/forbidden" element={<Forbidden />} />

            {/* ✅ [2] 관리자 보호 레이아웃(AdminLayout) 하위 라우팅 통합 */}
            <Route path="/admin" element={
                <PrivateRoute>
                    <RoleRoute>
                        <AdminLayout />
                    </RoleRoute>
                </PrivateRoute>
            }>
                {/* ✅ 관리자 본인 영역 */}
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="update" element={<AdminUpdate />} />
                <Route path="list" element={<AdminList />} />

                {/* ✅ 기업 관리 */}
                <Route path="company" element={<CompanyList />} />
                <Route path="company/:cno" element={<CompanyDetail />} />

                {/* ✅ 개발자 관리 */}
                <Route path="developer" element={<DeveloperList />} />
                <Route path="developer/:dno" element={<DeveloperDetail />} />

                {/* ✅ 기업 평가 */}
                <Route path="crating" element={<CratingList />} />
                <Route path="crating/:crno" element={<CratingDetail />} />

                {/* ✅ 개발자 평가 */}
                <Route path="drating" element={<DratingList />} />
                <Route path="drating/:drno" element={<DratingDetail />} />

                {/* ✅ 프로젝트 */}
                <Route path="project" element={<ProjectList />} />
                <Route path="project/:pno" element={<ProjectDetail />} />

                {/* ✅ 프로젝트 참여 */}
                <Route path="project-join" element={<ProjectJoinList />} />
                <Route path="project-join/:pjno" element={<ProjectJoinDetail />} />
            </Route>

            {/* ✅ [3] 기타 잘못된 경로 → 로그인 페이지로 강제 이동 */}
            <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
    );
}