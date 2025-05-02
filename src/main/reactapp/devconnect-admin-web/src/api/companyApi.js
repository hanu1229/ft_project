// companyApi.js | rw 25-05-02 최종 리팩토링
// [설명] 기업(Company) 관련 API 요청 함수 모음
//        - 관리자 및 기업 전용 기능 포함
//        - 모든 요청은 공통 Axios 인스턴스를 통해 통신됨

import axios from './axiosInstance'; // ✅ 공통 Axios 인스턴스 import

// =======================================================================================
// ✅ 1. 기업 회원가입 요청
/*
    매핑 방식: POST
    요청 URL: /api/company/signup
    요청 데이터: CompanyDto (RequestBody)
    응답 데이터: Boolean
*/
export const signupCompany = async (companyDto) => {
    return axios.post('/company/signup', companyDto, {
        headers: { 'Content-Type': 'application/json' },
    });
};

// =======================================================================================
// ✅ 2. 기업 로그인 요청
/*
    매핑 방식: POST
    요청 URL: /api/company/login
    요청 데이터: CompanyDto (RequestBody)
    응답 데이터: String (JWT 토큰)
*/
export const loginCompany = async (companyDto) => {
    return axios.post('/company/login', companyDto, {
        headers: { 'Content-Type': 'application/json' },
    });
};

// =======================================================================================
// ✅ 3. 기업 로그아웃 요청
/*
    매핑 방식: GET
    요청 URL: /api/company/logout
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: 없음 (204 No Content)
*/
export const logoutCompany = (token) => {
    return axios.get('/company/logout', {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 4. 기업 본인 정보 조회
/*
    매핑 방식: GET
    요청 URL: /api/company/info
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: CompanyDto
*/
export const getCompanyInfo = (token) => {
    return axios.get('/company/info', {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 5. 전체 기업 목록 조회
/*
    매핑 방식: GET
    요청 URL: /api/company/findall
    응답 데이터: List<CompanyDto>
*/
export const getCompanyList = () => {
    return axios.get('/company/findall');
};

// =======================================================================================
// ✅ 6. 기업 상태코드 변경 요청
/*
    매핑 방식: PUT
    요청 URL: /api/company/state
    요청 헤더: Authorization: Bearer {token}
    요청 데이터: CompanyDto (RequestBody)
    응답 데이터: Boolean
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
// ✅ 7. 기업 상세 정보 조회
/*
    매핑 방식: GET
    요청 URL: /api/company/detail?cno={cno}
    요청 파라미터: cno (기업 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: CompanyDto
*/
export const getCompanyDetail = (token, cno) => {
    return axios.get(`/company/detail?cno=${cno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 8. 기업 정보 수정 요청
/*
    매핑 방식: PUT
    요청 URL: /api/company/update
    요청 헤더: Authorization: Bearer {token}
    요청 데이터: CompanyDto (RequestBody)
    응답 데이터: Boolean
*/
export const updateCompany = (token, companyDto) => {
    return axios.put('/company/update', companyDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 9. 기업 삭제 요청
/*
    매핑 방식: DELETE
    요청 URL: /api/company?cno={cno}
    요청 파라미터: cno (기업 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: Boolean
*/
export const deleteCompany = (cno, token) => {
    return axios.delete(`/company?cno=${cno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};