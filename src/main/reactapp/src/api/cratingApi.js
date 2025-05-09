// =======================================================================================
// cratingApi.js | rw 25-05-02 최종 리팩토링
// [설명]
// - 기업 평가(Crating) 관련 관리자/개발자 전용 API 요청 함수 모음
// - 공통 Axios 인스턴스를 통해 모든 /api/crating 하위 요청 처리
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ baseURL: /api 기준

// =======================================================================================
// ✅ 1. 기업 평가 전체 목록 조회 (개발자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/crating
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 파라미터: page, size, keyword, dno (optional)
    - 응답 데이터: Page<CratingDto>
*/
export const getCratingList = (token, { page = 1, size = 5, keyword = '', dno = 0 }) => {
    return axios.get('/crating', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, keyword, dno },
    });
};

// =======================================================================================
// ✅ 2. 기업 평가 상세 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/crating/detail?crno={crno}
    - 요청 파라미터: crno (Query Param)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: CratingDto
*/
export const getCratingDetail = (token, crno) => {
    return axios.get(`/admin/crating/detail?crno=${crno}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// =======================================================================================
// ✅ 3. 기업 평가 등록 요청
/*
    - 매핑 방식: POST
    - 요청 URL: /api/crating
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 데이터: CratingDto (crscore, pno, dno 포함)
    - 응답 데이터: Boolean
*/
export const createCrating = (token, cratingDto) => {
    return axios.post('/crating', cratingDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 4. 기업 평가 수정 요청
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/crating
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 데이터: CratingDto (crno 필수)
    - 응답 데이터: Boolean
*/
export const updateCrating = (token, cratingDto) => {
    return axios.put('/crating', cratingDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 5. 기업 평가 삭제 요청
/*
    - 매핑 방식: DELETE
    - 요청 URL: /api/crating?crno=123
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteCrating = (token, crno) => {
    return axios.delete('/crating', {
        headers: { Authorization: `Bearer ${token}` },
        params: { crno },
    });
};