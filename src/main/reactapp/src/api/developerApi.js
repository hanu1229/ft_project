// =======================================================================================
// developerApi.js | rw 25-05-09 최종 리팩토링
// [설명]
// - 관리자(Admin) 전용 개발자(Developer) API 요청 함수 모음
// - 모든 요청은 axiosInstance.js의 baseURL(`/api`) 기준 상대경로로 구성됨
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 Axios 인스턴스 import

// =======================================================================================
// ✅ 1. 전체 개발자 목록 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/developer
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: List<DeveloperDto>
*/
export const getDeveloperList = (token) => {
    return axios.get('/developer/findall', {
        headers: { Authorization: `Bearer ${token}` },
    });
};


// =======================================================================================
// ✅ 2. 개발자 상세 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/developer/detail?dno={dno}
    - 요청 파라미터: dno (Query Param)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: DeveloperDto
*/
// 올바른 버전 (token 포함)
export const getDeveloperDetail = (token, dno) => {
    return axios.get(`/admin/developer/detail?dno=${dno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 3. 개발자 정보 수정 (개인 또는 관리자)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/developer/update
    - 요청 데이터: DeveloperDto (FormData)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const updateDeveloper = (token, formData) => {
    return axios.put('/developer/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

// =======================================================================================
// ✅ 4. 개발자 상태코드 수정 (관리자 전용)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/developer/delete
    - 요청 데이터: DeveloperDto (RequestBody - dno, dstate)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const updateDeveloperState = (token, dto) => {
    return axios.put('/developer/delete', dto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 5. 개발자 삭제 요청 (관리자 전용)
/*
    - 매핑 방식: DELETE
    - 요청 URL: /api/developer?dno={dno}
    - 요청 파라미터: dno (Query Param)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteDeveloper = (dno, token) => {
    return axios.delete(`/developer?dno=${dno}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};