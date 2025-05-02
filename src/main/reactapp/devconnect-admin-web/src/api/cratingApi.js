// cratingApi.js | rw 25-05-02 최종 리팩토링
// [설명] 기업 평가(Crating) 관련 API 요청 함수 모음
//        - 관리자 전용 기능 중심 (승인, 수정, 삭제 포함)
//        - 모든 요청은 공통 axios 인스턴스를 통해 처리됨

import axios from './axiosInstance'; // ✅ 공통 Axios 인스턴스 사용

// =======================================================================================
// ✅ 1. 전체 기업 평가 목록 조회
/*
    요청 방식: GET
    요청 URL: /api/crating
    응답 데이터: List<CratingDto>
*/
export const getCratingList = () => {
    return axios.get('/api/crating');
};

// =======================================================================================
// ✅ 2. 기업 평가 상세 조회
/*
    요청 방식: GET
    요청 URL: /api/crating/detail?crno={crno}
    요청 파라미터: crno (기업 평가 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: CratingDto
*/
export const getCratingDetail = (crno, token) => {
    return axios.get(`/api/crating/detail?crno=${crno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 3. 기업 평가 승인 요청
/*
    요청 방식: PUT
    요청 URL: /api/crating/approve?crno={crno}
    요청 파라미터: crno (기업 평가 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: Boolean
*/
export const approveCrating = (crno, token) => {
    return axios.put(`/api/crating/approve?crno=${crno}`, null, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 4. 기업 평가 수정 요청
/*
    요청 방식: PUT
    요청 URL: /api/crating
    요청 데이터: CratingDto (RequestBody)
    요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    응답 데이터: Boolean
*/
export const updateCrating = (token, cratingDto) => {
    return axios.put('/api/crating', cratingDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 5. 기업 평가 삭제 요청
/*
    요청 방식: DELETE
    요청 URL: /api/crating?crno={crno}
    요청 파라미터: crno (기업 평가 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: Boolean
*/
export const deleteCrating = (crno, token) => {
    return axios.delete(`/api/crating?crno=${crno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};