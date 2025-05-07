// =======================================================================================
// companyApi.js | rw 25-05-02 최종 리팩토링
// [설명]
// - 기업(Company) 관련 관리자 및 기업 전용 API 요청 함수 모음
// - baseURL은 axiosInstance.js에서 '/api'로 설정되어 있음
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 인스턴스 기반 요청 (baseURL = /api)

// =======================================================================================
// ✅ 1. 기업 회원가입 요청
/*
    - 매핑 방식: POST
    - 요청 URL: /api/company/signup
    - 요청 데이터: CompanyDto (FormData)
    - 응답 데이터: Boolean
*/
export const signupCompany = (formData) => {
    return axios.post('/company/signup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

// =======================================================================================
// ✅ 2. 기업 로그인 요청
/*
    - 매핑 방식: POST
    - 요청 URL: /api/company/login
    - 요청 데이터: CompanyDto (JSON)
    - 응답 데이터: String (JWT 토큰)
*/
export const loginCompany = (companyDto) => {
    return axios.post('/company/login', companyDto, {
        headers: { 'Content-Type': 'application/json' },
    });
};

// =======================================================================================
// ✅ 3. 기업 로그아웃 요청
/*
    - 매핑 방식: GET
    - 요청 URL: /api/company/logout
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: 없음
*/
export const logoutCompany = (token) => {
    return axios.get('/company/logout', {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 4. 기업 본인 정보 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/company/info
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: CompanyDto
*/
export const getCompanyInfo = (token) => {
    return axios.get('/company/info', {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 5. 전체 기업 목록 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/company/findall
    - 응답 데이터: List<CompanyDto>
*/
export const getCompanyList = () => {
    return axios.get('/company/findall');
};

// =======================================================================================
// ✅ 6. 기업 상태코드 변경 (관리자 전용)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/company/state
    - 요청 데이터: CompanyDto (JSON) → cno, state
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const updateCompanyState = (token, companyDto) => {
    return axios.put('/company/state', companyDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 7. 기업 상세 정보 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/company/detail?cno=#
    - 요청 파라미터: cno (Query Param)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: CompanyDto
*/
export const getCompanyDetail = (token, cno) => {
    return axios.get(`/company/detail?cno=${cno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 8. 기업 정보 수정 (관리자 또는 본인 수정)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/company/update
    - 요청 데이터: CompanyDto (FormData)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const updateCompany = (token, formData) => {
    return axios.put('/company/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

// =======================================================================================
// ✅ 9. 기업 삭제 요청 (관리자 전용)
/*
    - 매핑 방식: DELETE
    - 요청 URL: /api/company?cno=#
    - 요청 파라미터: cno (Query Param)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteCompany = (cno, token) => {
    return axios.delete(`/company?cno=${cno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};