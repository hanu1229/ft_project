// =======================================================================================
// AdminDashboard.jsx | rw 25-05-02 최종 리팩토링 + 로그인 수 통합 조회 포함
// [설명]
// - 관리자 대시보드 화면
// - Joy UI + Recharts 조합 / ChatGPT 스타일 흰 배경 테마 적용
// - 관리자 정보, 통계 카드, 최근 승인 리스트, 월별 차트, 로그인 통계 포함
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Grid, List, ListItem } from '@mui/joy';
import {
    getDashboardStats,
    getRecentApprovedList,
    getMonthlyJoinStats,
    getLoginCountAll
} from '../../api/adminApi.js';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [admin, setAdmin] = useState(null);
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState(null);
    const [monthlyJoins, setMonthlyJoins] = useState([]);
    const [loginCounts, setLoginCounts] = useState({ admin: 0, company: 0, developer: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAdmin({
                    adid: decoded.adid,
                    adname: decoded.adname,
                    role: decoded.role || decoded.adtype,
                    iat: new Date(decoded.iat * 1000).toLocaleString()
                });
            } catch (err) {
                console.error('JWT 디코딩 실패', err);
            }
        }

        getDashboardStats().then(res => setStats(res.data));
        getRecentApprovedList().then(res => setRecent(res.data));
        getMonthlyJoinStats().then(res => setMonthlyJoins(res.data));
        getLoginCountAll().then(res => setLoginCounts(res.data));
    }, []);

    const cardRoutes = {
        '기업 수': '/admin/company',
        '개발자 수': '/admin/developer',
        '프로젝트 수': '/admin/project',
        '참여 수': '/admin/project-join',
        '기업평가 수': '/admin/crating',
        '개발자평가 수': '/admin/drating'
    };

    return (
        <Box sx={{ bgcolor: '#ffffff', color: '#222', minHeight: '100vh', p: 4 }}>
            <Typography level="h3" sx={{ mb: 4, color: '#12b886' }}>관리자 대시보드</Typography>

            {/* ✅ 관리자 정보 카드 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid xs={12} sm={6} md={4}>
                    <Card variant="soft" sx={{ bgcolor: '#f8f9fa', border: '1px solid #12b886', borderRadius: '16px', color: '#333' }}>
                        <Typography level="title-md" sx={{ color: '#12b886' }}>👤 관리자 정보</Typography>
                        <Typography level="body-sm">ID: {admin?.adid}</Typography>
                        <Typography level="body-sm">이름: {admin?.adname}</Typography>
                        <Typography level="body-sm">권한: {admin?.role}</Typography>
                        <Typography level="body-sm">로그인 시간: {admin?.iat}</Typography>
                        <Typography level="body-sm" sx={{ mt: 1, color: '#4dabf7' }}>
                            최근 24시간 접속자 수 - 관리자: {loginCounts.admin}명 / 기업: {loginCounts.company}명 / 개발자: {loginCounts.developer}명
                        </Typography>
                    </Card>
                </Grid>
            </Grid>

            {/* ✅ 통계 카드 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {stats && [
                    ['기업 수', stats.companyCount],
                    ['개발자 수', stats.developerCount],
                    ['프로젝트 수', stats.projectCount],
                    ['참여 수', stats.projectJoinCount],
                    ['기업평가 수', stats.cratingCount],
                    ['개발자평가 수', stats.dratingCount],
                ].map(([label, count], idx) => (
                    <Grid key={idx} xs={12} sm={6} md={4}>
                        <Card
                            variant="soft"
                            onClick={() => navigate(cardRoutes[label])}
                            sx={{
                                bgcolor: '#f1f3f5',
                                border: '1px solid #12b886',
                                borderRadius: '16px',
                                color: '#212529',
                                cursor: 'pointer',
                                '&:hover': {
                                    boxShadow: '0 0 10px #b2f2bb',
                                    transform: 'scale(1.02)'
                                }
                            }}
                        >
                            <Typography level="title-md" sx={{ color: '#12b886' }}>{label}</Typography>
                            <Typography level="h2" sx={{ color: '#212529' }}>{count}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ✅ 최근 승인 항목 카드 */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {recent && ['companies', 'developers', 'projects'].map((key, idx) => (
                    <Grid key={idx} xs={12} sm={4}>
                        <Card variant="soft" sx={{ bgcolor: '#f8f9fa', border: '1px solid #dee2e6', borderRadius: '16px', color: '#222' }}>
                            <Typography level="title-md" sx={{ color: '#12b886' }}>최근 승인된 {key}</Typography>
                            <List>
                                {(recent[key] || []).map((item, i) => (
                                    <ListItem key={i} sx={{ cursor: 'pointer' }}
                                              onClick={() => {
                                                  if (key === 'companies') navigate(`/admin/company/${item.id}`);
                                                  if (key === 'developers') navigate(`/admin/developer/${item.id}`);
                                                  if (key === 'projects') navigate(`/admin/project/${item.id}`);
                                              }}
                                    >
                                        <Box>
                                            <Typography level="body-md" sx={{ color: '#087f5b', textDecoration: 'underline' }}>{item.name}</Typography>
                                            <Typography level="body-sm" textColor="neutral.400">{item.updateAt || item.approvedAt}</Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ✅ 월별 프로젝트 참여 추이 차트 */}
            <Card sx={{ bgcolor: '#ffffff', border: '1px solid #ced4da', borderRadius: '16px', p: 3, color: '#000' }}>
                <Typography level="title-md" sx={{ mb: 2, color: '#12b886' }}>📈 월별 프로젝트 참여 추이</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyJoins}>
                        <CartesianGrid stroke="#dee2e6" strokeDasharray="3 3" />
                        <XAxis dataKey="month" stroke="#333" />
                        <YAxis stroke="#333" />
                        <Tooltip />
                        <Line type="monotone" dataKey="joins" stroke="#12b886" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </Box>
    );
}
