// dratingApi.js | rw 25-05-02 최종 리팩토링
// [설명] 개발자 평가(Drating) 관련 API 요청 함수 모음
//        - 관리자 전용 승인/조회/삭제 기능 포함
//        - 모든 요청은 공통 axios 인스턴스를 통해 처리됨

import axios from './axiosInstance'; // ✅ 공통 Axios 인스턴스 사용

// =======================================================================================
// ✅ 1. 전체 개발자 평가 목록 조회
/*
    요청 방식: GET
    요청 URL: /api/drating
    응답 데이터: List<DratingDto>
*/
export const getDratingList = () => {
    return axios.get('/api/drating');
};

// =======================================================================================
// ✅ 2. 개발자 평가 상세 조회
/*
    요청 방식: GET
    요청 URL: /api/drating/detail?drno={drno}
    요청 파라미터: drno (개발자 평가 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: DratingDto
*/
export const getDratingDetail = (drno, token) => {
    return axios.get(`/drating/detail?drno=${drno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 3. 개발자 평가 승인 요청
/*
    요청 방식: PUT
    요청 URL: /api/drating/approve?drno={drno}
    요청 파라미터: drno (개발자 평가 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: Boolean
*/
export const approveDrating = (drno, token) => {
    return axios.put(`/drating/approve?drno=${drno}`, null, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 4. 개발자 평가 수정 요청
/*
    요청 방식: PUT
    요청 URL: /api/drating
    요청 데이터: DratingDto (RequestBody)
    요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    응답 데이터: Boolean
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
    요청 방식: DELETE
    요청 URL: /api/drating?drno={drno}
    요청 파라미터: drno (개발자 평가 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: Boolean
*/
export const deleteDrating = (drno, token) => {
    return axios.delete(`/drating?drno=${drno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};
