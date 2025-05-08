// developerApi.js | rw 25-05-02 최종 리팩토링
// [설명] 개발자(Developer) 관련 관리자 및 본인 전용 API 요청 함수 모음
//        - 모든 요청은 axiosInstance.js의 baseURL("/api") 하위에서 처리됨

import axios from './axiosInstance.js'; // ✅ 공통 Axios 인스턴스 import

// =======================================================================================
// ✅ 1. 전체 개발자 목록 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/developer/findall
    - 요청 데이터: 없음
    - 응답 데이터: List<DeveloperDto>
*/
export const getDeveloperList = () => {
    return axios.get('/developer/findall');
};

// =======================================================================================
// ✅ 2. 개발자 상세 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/developer/detail?dno={dno}
    - 요청 파라미터: dno (Query Param)
    - 응답 데이터: DeveloperDto
*/
export const getDeveloperDetail = (dno) => {
    return axios.get(`/developer/detail?dno=${dno}`);
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
