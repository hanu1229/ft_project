import axios from './axiosInstance.js'; // ✅ 공통 Axios 인스턴스

// =======================================================================================
// ✅ 1. 기업 평가 전체 목록 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/crating
    - 요청 파라미터: page, size, keyword, dno (선택)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Page<CratingDto>
*/
export const getCratingList = (token, { page = 0, size = 10, keyword = '', dno } = {}) => {
    return axios.get('/crating', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, keyword, dno },
    });
};

// =======================================================================================
// ✅ 2. 기업 평가 상세 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/crating/view
    - 요청 파라미터: crno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: CratingDto
*/
export const getCratingDetail = (token, crno) => {
    return axios.get('/crating/view', {
        headers: { Authorization: `Bearer ${token}` },
        params: { crno },
    });
};

// =======================================================================================
// ✅ 3. 기업 평가 등록
/*
    - 매핑 방식: POST
    - 요청 URL: /api/crating
    - 요청 데이터: CratingDto (RequestBody)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const createCrating = (token, cratingDto) => {
    return axios.post('/crating', cratingDto, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 4. 기업 평가 수정 (→ updateCratingState 로 통일)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/crating
    - 요청 데이터: CratingDto (RequestBody)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const updateCratingState = (token, cratingDto) => {
    return axios.put('/crating', cratingDto, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 5. 기업 평가 삭제 (→ deleteCratingState 로 통일)
/*
    - 매핑 방식: DELETE
    - 요청 URL: /api/crating
    - 요청 파라미터: crno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
// export const deleteCratingState = (token, crno) => {
//     return axios.delete('/crating', {
//         headers: { Authorization: `Bearer ${token}` },
//         params: { crno },
//     });
// };