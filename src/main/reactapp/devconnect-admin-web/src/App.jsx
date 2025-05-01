// App.jsx | rw 25-05-01
// [설명] devconnect-admin-web 전체 관리자 전용 라우팅 구성 파일
//        - PrivateRoute: 로그인 여부 검사
//        - RoleRoute: 관리자 권한 검사
//        - 모든 페이지는 관리자만 접근 가능

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// ✅ 인증 / 권한 보호 라우터
import PrivateRoute from './routes/PrivateRoute';
import RoleRoute from './routes/RoleRoute';

// ✅ 인증 관련 화면
import AdminLogin from './pages/admin/AdminLogin';
import AdminSignup from './pages/admin/AdminSignup';

// ✅ 관리자 대시보드
import AdminDashboard from './pages/admin/AdminDashboard';

// ✅ 기업 관련 화면
import CompanyList from './pages/admin/CompanyList';
import CompanyDetail from './pages/admin/CompanyDetail';

// ✅ 개발자 관련 화면
import DeveloperList from './pages/admin/DeveloperList';
import DeveloperDetail from './pages/admin/DeveloperDetail';

// ✅ 프로젝트 및 참여
import ProjectList from './pages/admin/ProjectList';
import ProjectDetail from './pages/admin/ProjectDetail';
import ProjectJoinList from './pages/admin/ProjectJoinList';
import ProjectJoinDetail from './pages/admin/ProjectJoinDetail';

// ✅ 평가 (기업, 개발자)
import CratingList from './pages/admin/CratingList';
import CratingDetail from './pages/admin/CratingDetail';
import DratingList from './pages/admin/DratingList';
import DratingDetail from './pages/admin/DratingDetail';

// ✅ 접근 권한 거부 화면
import Forbidden from './pages/admin/Forbidden';

export default function App() {
    return (
        <Routes>
            {/* ✅ 로그인 / 회원가입 */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/signup" element={<AdminSignup />} />

            {/* ✅ 권한 없음 진입 시 */}
            <Route path="/admin/forbidden" element={<Forbidden />} />

            {/* ✅ 관리자 보호 라우팅 시작 */}
            <Route
                path="/admin/dashboard"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <AdminDashboard />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />

            {/* ✅ 기업 관리 */}
            <Route
                path="/admin/company"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <CompanyList />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/company/:cno"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <CompanyDetail />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />

            {/* ✅ 개발자 관리 */}
            <Route
                path="/admin/developer"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <DeveloperList />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/developer/:dno"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <DeveloperDetail />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />

            {/* ✅ 프로젝트 */}
            <Route
                path="/admin/project"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <ProjectList />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/project/:pno"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <ProjectDetail />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />

            {/* ✅ 프로젝트 참여 */}
            <Route
                path="/admin/project-join"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <ProjectJoinList />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/project-join/:pjno"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <ProjectJoinDetail />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />

            {/* ✅ 평가 관리 (기업) */}
            <Route
                path="/admin/crating"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <CratingList />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/crating/:crno"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <CratingDetail />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />

            {/* ✅ 평가 관리 (개발자) */}
            <Route
                path="/admin/drating"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <DratingList />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />
            <Route
                path="/admin/drating/:drno"
                element={
                    <PrivateRoute>
                        <RoleRoute>
                            <DratingDetail />
                        </RoleRoute>
                    </PrivateRoute>
                }
            />
        </Routes>
    );
}