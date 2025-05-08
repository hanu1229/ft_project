// =======================================================================================
// developerApi.js | rw 25-05-08 관리자 전용 기준 전면 리팩토링
// [설명]
// - 개발자(Developer) 관련 API 요청 함수 모음
// - 모든 요청은 관리자 권한 기준으로 동작하며 토큰 필수
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 Axios 인스턴스 사용

// =======================================================================================
// ✅ 1. 전체 개발자 목록 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/developer
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: List<DeveloperDto>
*/
export const getDeveloperList = (token) => {
    return axios.get('/developer', {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 2. 개발자 상세 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/developer/detail?dno=3
    - 요청 파라미터: dno (개발자 번호)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: DeveloperDto
*/
export const getDeveloperDetail = (token, dno) => {
    return axios.get(`/developer/detail`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { dno },
    });
};

// =======================================================================================
// ✅ 3. 개발자 정보 수정 (관리자 직권 수정)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/developer
    - 요청 데이터: DeveloperDto (RequestBody)
    - 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    - 응답 데이터: Boolean
*/
export const updateDeveloper = (token, dto) => {
    return axios.put('/developer', dto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 4. 개발자 삭제 처리 (관리자 직권 삭제)
/*
    - 매핑 방식: DELETE
    - 요청 URL: /api/developer?dno=#
    - 요청 파라미터: dno (개발자 번호)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteDeveloper = (token, dno) => {
    return axios.delete('/developer', {
        headers: { Authorization: `Bearer ${token}` },
        params: { dno },
    });
};

// =======================================================================================
// ✅ 5. 개발자 상태코드 변경 (직권 상태 변경)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/developer/state
    - 요청 데이터: DeveloperDto (dno, dstate)
    - 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    - 응답 데이터: Boolean
*/
export const updateDeveloperState = (token, dto) => {
    return axios.put('/developer/state', dto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};
