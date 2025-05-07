import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// ✅ 보호 라우터
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

// ✅ 공통 레이아웃
import AdminLayout from './layouts/AdminLayout';

// ✅ 인증 관련 페이지
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';
import Forbidden from './pages/admin/Forbidden';

// ✅ 관리자 본인 기능
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUpdate from './pages/admin/AdminUpdate';
import AdminList from './pages/admin/AdminList'; // 💡 관리자 목록도 포함

// ✅ 기업 관리
import CompanyList from './pages/admin/CompanyList';
import CompanyDetail from './pages/admin/CompanyDetail';

// ✅ 개발자 관리
import DeveloperList from './pages/admin/DeveloperList';
import DeveloperDetail from './pages/admin/DeveloperDetail';

// ✅ 평가 관리
import CratingList from './pages/admin/CratingList';
import CratingDetail from './pages/admin/CratingDetail';
import DratingList from './pages/admin/DratingList';
import DratingDetail from './pages/admin/DratingDetail';

// ✅ 프로젝트 관리
import ProjectList from './pages/admin/ProjectList';
import ProjectDetail from './pages/admin/ProjectDetail';

// ✅ 프로젝트 참여 관리
import ProjectJoinList from './pages/admin/ProjectJoinList';
import ProjectJoinDetail from './pages/admin/ProjectJoinDetail';

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