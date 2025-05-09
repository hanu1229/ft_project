// =======================================================================================
// companyApi.js | rw 25-05-08 전면 리팩토링 (관리자 직권 기준 API 구성)
// [설명]
// - 관리자(Admin)만 접근 가능한 기업 관련 API 요청 함수 모음
// - 모든 요청 URL은 axiosInstance.js의 baseURL(`/api`) 기준 상대경로로 작성됨
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 Axios 인스턴스

// =======================================================================================
// ✅ 1. 기업 전체 목록 조회 (페이징 포함)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/company
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 파라미터: page, size, keyword (선택)
    - 응답 데이터: Page<CompanyDto>
*/
export const getCompanyList = (token, { page = 0, size = 10, keyword = '' }) => {
    return axios.get('/company/findall', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, keyword },
    });
};

// =======================================================================================
// ✅ 2. 기업 상세 정보 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/company/detail
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 파라미터: cno
    - 응답 데이터: CompanyDto
*/
export const getCompanyDetail = (token, cno) => {
    return axios.get('/admin/company/detail', {
        headers: { Authorization: `Bearer ${token}` },
        params: { cno },
    });
};

// =======================================================================================
// ✅ 3. 기업 정보 수정 (FormData)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/company/update
    - 요청 데이터: CompanyDto (FormData 형태)
    - 요청 헤더: Authorization: Bearer {token}, multipart/form-data
    - 응답 데이터: Boolean
*/
export const  updateCompanyState = (token, formData) => {
    return axios.put('/company/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

// =======================================================================================
// ✅ 4. 기업 상태코드 변경
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/company/state
    - 요청 데이터: { cno, cstate } (RequestBody)
    - 요청 헤더: Authorization: Bearer {token}, application/json
    - 응답 데이터: Boolean
*/
export const changeCompanyState = (token, dto) => {
    return axios.put('/company/state', dto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 5. 기업 삭제 (관리자 직권 삭제)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/company/delete
    - 요청 데이터: { cno } (RequestBody)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteCompanyState = (token, dto) => {
    return axios.put('/company/delete', dto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};
