// =======================================================================================
// adminApi.js | rw 25-05-09 최종 리팩토링
// [설명]
// - 관리자(Admin) 관련 API 요청 함수 모음
// - 모든 요청 URL은 axiosInstance.js의 baseURL(`/api`) 기준 상대경로로 작성됨
// - 모든 기능은 관리자 권한으로만 접근 가능함
// =======================================================================================

import axios from './axiosInstance'; // ✅ 공통 Axios 인스턴스

// =======================================================================================
// ✅ 1. 관리자 회원가입 요청
/*
    - 매핑 방식: POST
    - 요청 URL: /api/admin/signup
    - 요청 데이터: AdminDto (RequestBody)
    - 응답 데이터: Boolean
*/
export const signupAdmin = (adminDto) => {
    return axios.post('/admin/signup', adminDto);
};

// =======================================================================================
// ✅ 2. 관리자 로그인 요청
/*
    - 매핑 방식: POST
    - 요청 URL: /api/admin/login
    - 요청 데이터: AdminLoginDto (RequestBody)
    - 응답 데이터: String (JWT 토큰)
*/
export const loginAdmin = (loginDto) => {
    return axios.post('/admin/login', loginDto);
};

// =======================================================================================
// ✅ 3. 로그인한 관리자 본인 정보 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/info
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: AdminDto
*/
export const getAdminInfo = (token) => {
    return axios.get('/admin/info', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// =======================================================================================
// ✅ 4. 전체 관리자 목록 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/allinfo
    - 응답 데이터: List<AdminDto>
*/
export const getAdminList = () => {
    return axios.get('/admin/allinfo');
};

// =======================================================================================
// ✅ 5. 관리자 정보 수정
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/admin/update
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 데이터: FormData(AdminDto)
    - 응답 데이터: Boolean
*/
export const updateAdmin = (token, formData) => {
    return axios.put('/admin/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
};

// =======================================================================================
// ✅ 6. 관리자 삭제 (※ REST 원칙 예외: PUT 방식 사용)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/admin/delete?adid=xxx
    - 응답 데이터: Boolean
*/
export const deleteAdmin = (adid) => {
    return axios.put(`/admin/delete?adid=${adid}`);
};

// =======================================================================================
// ✅ 7. 관리자 로그아웃 처리
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/logout
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: 없음 (204 No Content)
*/
export const logoutAdmin = (token) => {
    return axios.get('/admin/logout', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

// =======================================================================================
// ✅ 8. 관리자 대시보드 통계 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/stats
    - 응답 데이터: Map<String, Object>
      ex) { companyCount: 5, developerCount: 10, ... }
*/
export const getDashboardStats = () => {
    return axios.get('/admin/stats');
};

// =======================================================================================
// ✅ 9. 최근 승인 항목 리스트 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/recent-approved
    - 응답 데이터: Map<String, List<Object>>
      ex) { companies: [...], developers: [...], projects: [...] }
*/
export const getRecentApprovedList = () => {
    return axios.get('/admin/recent-approved');
};

// =======================================================================================
// ✅ 10. 월별 프로젝트 참여 수 통계 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/monthly-join
    - 응답 데이터: List<{ month: String, joins: Number }>
*/
export const getMonthlyJoinStats = () => {
    return axios.get('/admin/monthly-join');
};

// =======================================================================================
// ✅ 11. 최근 24시간 로그인 수 전체 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/login/count/all
    - 응답 데이터: Map<String, Integer>
      ex) { admin: 3, company: 6, developer: 9 }
*/
export const getLoginCountAll = () => {
    return axios.get('/admin/login/count/all');
};

// =======================================================================================
// ✅ 12. Redis 상태 확인 (선택 기능)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/redis-status
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: { status: "CONNECTED", timestamp: ... }
*/
export const getRedisStatus = (token) => {
    return axios.get('/admin/redis-status', {
        headers: { Authorization: `Bearer ${token}` },
    });
};