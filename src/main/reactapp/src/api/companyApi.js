// =======================================================================================
// companyApi.js | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자(Admin) 권한으로 기업(Company) 정보를 조회, 수정, 삭제할 수 있는 API 함수 모음
// - 모든 요청은 공통 인스턴스(axiosInstance.js)의 baseURL(`/api`)를 기준으로 상대경로 작성됨
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 인스턴스 기반 요청 (baseURL = /api)


// =======================================================================================
// ✅ 1. 관리자 기반 기업 전체 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/company/findall
- 요청 데이터: 없음
- 요청 헤더: 없음
- 응답 데이터: List<CompanyDto>
*/
export const getCompanyList = () => {
    return axios.get('/company/findall');
};

// =======================================================================================
// ✅ 2. 관리자 기반 기업 상세 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/admin/company/detail?cno={cno}
- 요청 파라미터: cno (Query Param)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: CompanyDto
*/
export const getCompanyDetail = (token, cno) => {
    return axios.get(`/admin/company/detail?cno=${cno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 3. 관리자 기반 기업 수정
/*
- 매핑 방식: PUT
- 요청 URL: /api/company/update
- 요청 데이터: CompanyDto (FormData)
- 요청 헤더: Authorization: Bearer {token}, Content-Type: multipart/form-data
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
// ✅ 4. 관리자 기반 기업 삭제
/*
- 매핑 방식: PUT (논리 삭제 또는 보안상 이유로 PUT 사용)
- 요청 URL: /admin/company/delete?cno={cno}
- 요청 파라미터: cno (Query Param)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Boolean
*/
export const deleteCompany = (cno, token) => {
    return axios.put(`/admin/company/delete?cno=${cno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};