// =======================================================================================
// dratingApi.js | rw 25-05-08 관리자 기준 리팩토링
// [설명]
// - 관리자(Admin) 전용 개발자 평가(DRating) API 함수 모음
// - 모든 요청은 인증 토큰(Authorization: Bearer {token}) 필요
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 Axios 인스턴스

// =======================================================================================
// ✅ [1]. 전체 개발자 평가 목록 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/drating
    - 요청 파라미터: page, size, keyword (QueryParam, optional)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Page<DratingDto>
*/
export const getDratingList = (token, { page = 0, size = 10, keyword = '' }) => {
    return axios.get('/drating', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, keyword },
    });
};

// =======================================================================================
// ✅ [2]. 개발자 평가 상세 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/drating/view
    - 요청 파라미터: drno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: DratingDto
*/
export const getDratingDetail = (token, drno) => {
    return axios.get('/drating/view', {
        headers: { Authorization: `Bearer ${token}` },
        params: { drno },
    });
};

// =======================================================================================
// ✅ [3]. 개발자 평가 등록 (관리자 전용)
/*
    - 매핑 방식: POST
    - 요청 URL: /api/drating
    - 요청 데이터: DratingDto (RequestBody)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const createDrating = (token, dto) => {
    return axios.post('/drating', dto, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ [4]. 개발자 평가 수정 (관리자 전용)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/drating
    - 요청 데이터: DratingDto (RequestBody)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const updateDrating = (token, dto) => {
    return axios.put('/drating', dto, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ [5]. 개발자 평가 삭제 (관리자 전용)
/*
    - 매핑 방식: DELETE
    - 요청 URL: /api/drating?drno=#
    - 요청 파라미터: drno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteDrating = (token, drno) => {
    return axios.delete('/drating', {
        headers: { Authorization: `Bearer ${token}` },
        params: { drno },
    });
};