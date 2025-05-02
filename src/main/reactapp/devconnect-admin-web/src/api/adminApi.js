// adminApi.js | rw 25-05-02 최종 리팩토링
// [설명] 관리자(Admin) 관련 API 요청 함수 모음
//        - 공통 Axios 인스턴스를 통한 HTTP 요청 처리
//        - 각 함수별 매핑 방식, 요청/응답 데이터 구조 명시

import axios from './axiosInstance'; // ✅ 공통 Axios 인스턴스

// =======================================================================================
// ✅ 1. 관리자 회원가입
/*
    - 매핑 방식: POST
    - 요청 URL: /api/admin/signup
    - 요청 데이터: AdminDto (RequestBody)
    - 응답 데이터: Boolean
*/
export const signupAdmin = (adminDto) => {
    return axios.post('/api/admin/signup', adminDto, {
        headers: { 'Content-Type': 'application/json' },
    });
};

// =======================================================================================
// ✅ 2. 관리자 로그인
/*
    - 매핑 방식: POST
    - 요청 URL: /api/admin/login
    - 요청 데이터: AdminLoginDto (RequestBody)
    - 응답 데이터: String (JWT 토큰)
*/
export const adminLogin = (adminLoginDto) => {
    return axios.post('/api/admin/login', adminLoginDto, {
        headers: { 'Content-Type': 'application/json' },
    });
};

// =======================================================================================
// ✅ 3. 관리자 본인 정보 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/info
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: AdminDto
*/
export const getAdminInfo = (token) => {
    return axios.get('/api/admin/info', {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 4. 관리자 전체 목록 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/allinfo
    - 응답 데이터: List<AdminDto>
*/
export const getAdminList = () => {
    return axios.get('/api/admin/allinfo');
};

// =======================================================================================
// ✅ 5. 관리자 정보 수정
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/admin/update
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 데이터: FormData (AdminDto 포함)
    - 응답 데이터: Boolean
*/
export const updateAdmin = (token, formData) => {
    return axios.put('/api/admin/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

// =======================================================================================
// ✅ 6. 관리자 삭제 요청
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/admin/delete?adid=xxx
    - 요청 파라미터: adid (String)
    - 응답 데이터: Boolean
*/
export const deleteAdmin = (adid) => {
    return axios.put(`/api/admin/delete?adid=${adid}`);
};

// =======================================================================================
// ✅ 7. 관리자 로그아웃
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/logout
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: 없음 (204 No Content)
*/
export const logoutAdmin = (token) => {
    return axios.get('/api/admin/logout', {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 8. 대시보드 통계 카드 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/stats
    - 응답 데이터: Map<String, Object>
*/
export const getDashboardStats = () => {
    return axios.get('/api/admin/stats');
};

// =======================================================================================
// ✅ 9. 최근 승인 항목 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/recent-approved
    - 응답 데이터: Map<String, Object> (companies, developers, projects)
*/
export const getRecentApprovedList = () => {
    return axios.get('/api/admin/recent-approved');
};

// =======================================================================================
// ✅ 10. 월별 프로젝트 참여 수 통계
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/monthly-join
    - 응답 데이터: List<Map<String, Object>>
*/
export const getMonthlyJoinStats = () => {
    return axios.get('/api/admin/monthly-join');
};

// =======================================================================================
// ✅ 11. 최근 24시간 로그인 수 전체 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/login/count/all
    - 설명: 관리자, 기업, 개발자 최근 24시간 로그인 수 통합 조회
    - 응답 데이터: Map<String, Integer>
*/
export const getLoginCountAll = () => {
    return axios.get('/api/admin/login/count/all');
};

// =======================================================================================
// ⚠️ 12. Redis 상태 확인 (옵션)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/redis-status
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: { status: String, timestamp: String }
*/
export const getRedisStatus = (token) => {
    return axios.get('/api/admin/redis-status', {
        headers: { Authorization: `Bearer ${token}` },
    });
};