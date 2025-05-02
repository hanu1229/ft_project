// dratingApi.js | rw 25-05-02 최종 리팩토링
// [설명]
// - 개발자 평가(Drating) 관련 API 요청 함수 모음
// - 모든 요청 URL은 axiosInstance.js 기준(baseURL: /api) 하위 경로로 설정됨

import axios from './axiosInstance'; // ✅ 공통 Axios 인스턴스 사용

// =======================================================================================
// ✅ 1. 전체 개발자 평가 목록 조회 (회사/관리자 공용)
/*
    - 매핑 방식: GET
    - 요청 URL: /drating
    - 요청 파라미터: page, size, keyword, dno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Page<DratingDto>
*/
export const getDratingList = (token, { page = 1, size = 5, keyword = '', dno = 0 }) => {
    const params = new URLSearchParams({ page, size, keyword, dno }).toString();
    return axios.get(`/drating?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 2. 개발자 평가 상세 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /drating/view?drno={drno}
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: DratingDto
*/
export const getDratingDetail = (token, drno) => {
    return axios.get(`/drating/view?drno=${drno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 3. 개발자 평가 등록
/*
    - 매핑 방식: POST
    - 요청 URL: /drating
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 데이터: DratingDto (drscore, pno, dno 등)
    - 응답 데이터: Boolean
*/
export const createDrating = (token, dratingDto) => {
    return axios.post('/drating', dratingDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 4. 개발자 평가 수정 요청
/*
    - 매핑 방식: PUT
    - 요청 URL: /drating
    - 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    - 요청 데이터: DratingDto (drno, drscore 필수)
    - 응답 데이터: Boolean
*/
export const updateDrating = (token, dratingDto) => {
    return axios.put('/drating', dratingDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 5. 개발자 평가 삭제 요청
/*
    - 매핑 방식: DELETE
    - 요청 URL: /drating?drno={drno}
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteDrating = (token, drno) => {
    return axios.delete(`/drating?drno=${drno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};