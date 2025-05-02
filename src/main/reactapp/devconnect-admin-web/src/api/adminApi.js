// adminApi.js | rw 25-05-01 (정리 완료)
// [설명] 관리자(Admin) 관련 API 요청 함수 모음
//        모든 요청은 커스텀 axios 인스턴스를 통해 이루어짐

import axios from "./axiosInstance"; // 공통 인스턴스 사용

// ✅ 1. 관리자 로그인 (POST /login)
export const signupAdmin = async (adminDto) => {
    return await axios.post('/admin/signup', adminDto, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

// ✅ 2. 관리자 본인 정보 조회 (GET /info)
export const getAdminInfo = () => {
    return axios.get("/api/admin/info");
};

// ✅ 3. 관리자 정보 수정 (PUT /update) - formData 전송
export const updateAdmin = (formData) => {
    return axios.put("/api/admin/update", formData);
};

// ✅ 4. 관리자 전체 목록 조회 (GET /allinfo)
export const getAdminList = () => {
    return axios.get("/api/admin/allinfo");
};

// ✅ 5. 관리자 삭제 요청 (PUT /delete?adid=xxx)
export const deleteAdmin = (adid) => {
    return axios.put(`/api/admin/delete?adid=${adid}`);
};

// ✅ 6. 관리자 로그아웃 (GET /logout)
export const logoutAdmin = () => {
    return axios.get("/api/admin/logout");
};

// ✅ 7. Redis 상태 확인 (GET /admin/redis-status)
export const getRedisStatus = (token) =>
    axios.get('/admin/redis-status', {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 8. 전체 통계 조회 (기업/개발자/프로젝트/참여/평가)
export const getDashboardStats = (token) =>
    axios.get('/admin/stats', {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 9. 최근 승인된 항목 (기업/개발자/프로젝트)
export const getRecentItems = (token) =>
    axios.get('/admin/recent-approved', {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 10. 월별 프로젝트 참여 추이 (차트용)
export const getMonthlyJoins = (token) =>
    axios.get('/admin/monthly-join', {
        headers: { Authorization: `Bearer ${token}` },
    });
