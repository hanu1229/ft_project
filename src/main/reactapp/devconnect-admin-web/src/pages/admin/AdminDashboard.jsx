// AdminDashboard.jsx | rw 25-05-01
// [설명] 관리자 대시보드 - 전체 통계 카드, 최근 승인 리스트, Recharts 차트 통합 구현

import React, { useEffect, useState } from 'react';
import { Box, Card, Typography, Grid, List, ListItem } from '@mui/joy'; // ✅ 수정 완료
import { getRedisStatus, getDashboardStats, getRecentItems, getMonthlyJoins } from '../../api/adminApi';
import { jwtDecode } from "jwt-decode";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [admin, setAdmin] = useState(null);
    const [redis, setRedis] = useState(null);
    const [stats, setStats] = useState(null);
    const [recent, setRecent] = useState(null);
    const [monthlyJoins, setMonthlyJoins] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('token');

        // ✅ [1] 로그인 관리자 정보 디코딩
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setAdmin({
                    adid: decoded.adid,
                    adname: decoded.adname,
                    role: decoded.role || decoded.adtype,
                    iat: new Date(decoded.iat * 1000).toLocaleString(),
                });
            } catch (err) {
                console.error('JWT 디코딩 실패', err);
            }
        }

        // ✅ [2] Redis 상태 확인
        getRedisStatus(token).then(res => setRedis(res.data)).catch(() => setRedis({ status: 'DISCONNECTED' }));

        // ✅ [3] 통계 카드 데이터 조회
        getDashboardStats(token).then(res => setStats(res.data));

        // ✅ [4] 최근 승인 항목 조회
        getRecentItems(token).then(res => setRecent(res.data));

        // ✅ [5] 월별 프로젝트 참여 차트 데이터
        getMonthlyJoins(token).then(res => setMonthlyJoins(res.data));
    }, []);

    return (
        <Box>
            <Typography level="h3" sx={{ mb: 3 }}>관리자 대시보드</Typography>

            {/* ✅ 관리자 정보 + Redis 상태 */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid xs={12} sm={6} md={4}>
                    <Card>
                        <Typography level="title-md">👤 관리자 정보</Typography>
                        <Typography level="body-sm">ID: {admin?.adid}</Typography>
                        <Typography level="body-sm">이름: {admin?.adname}</Typography>
                        <Typography level="body-sm">권한: {admin?.role}</Typography>
                        <Typography level="body-sm">로그인 시간: {admin?.iat}</Typography>
                    </Card>
                </Grid>

                <Grid xs={12} sm={6} md={4}>
                    <Card color={redis?.status === 'CONNECTED' ? 'success' : 'danger'}>
                        <Typography level="title-md">📦 Redis 상태</Typography>
                        <Typography level="body-sm">상태: {redis?.status}</Typography>
                        {redis?.timestamp && (
                            <Typography level="body-sm">
                                응답 시간: {new Date(redis.timestamp).toLocaleString()}
                            </Typography>
                        )}
                    </Card>
                </Grid>
            </Grid>

            {/* ✅ 통계 카드 */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {stats && [
                    ['🏢 기업', stats.companyCount],
                    ['👨‍💻 개발자', stats.developerCount],
                    ['📁 프로젝트', stats.projectCount],
                    ['🤝 참여', stats.projectJoinCount],
                    ['📝 기업평가', stats.cratingCount],
                    ['🧾 개발자평가', stats.dratingCount]
                ].map(([label, count], idx) => (
                    <Grid key={idx} xs={12} sm={6} md={4}>
                        <Card>
                            <Typography level="title-md">{label} 수</Typography>
                            <Typography level="h2">{count}</Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ✅ 최근 승인된 항목 리스트 */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                {recent && ['companies', 'developers', 'projects'].map((key, idx) => (
                    <Grid key={idx} xs={12} sm={4}>
                        <Card>
                            <Typography level="title-md">최근 승인된 {key}</Typography>
                            <List>
                                {(recent[key] || []).map((item, i) => (
                                    <ListItem key={i}>
                                        <Box>
                                            <Typography level="body-md">
                                                {item.name || item.cname || item.dname || item.pname}
                                            </Typography>
                                            <Typography level="body-sm" textColor="neutral.500">
                                                {item.updateAt || item.approvedAt}
                                            </Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ✅ Recharts 차트 */}
            <Card>
                <Typography level="title-md" sx={{ mb: 2 }}>📈 월별 프로젝트 참여 추이</Typography>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyJoins}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="joins" stroke="#8884d8" />
                    </LineChart>
                </ResponsiveContainer>
            </Card>
        </Box>
    );
}