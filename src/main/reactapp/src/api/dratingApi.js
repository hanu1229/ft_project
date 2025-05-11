// =======================================================================================
// dratingApi.js | rw 25-05-10 최종 리팩토링
// [설명]
// - 개발자 평가(Drating)는 프로젝트 단위에서 개발자의 신뢰도 및 활동 이력을 평가하는 관리자 전용 기능입니다.
// - 모든 요청은 공통 인스턴스(axiosInstance.js)의 baseURL(`/api`) 기준 상대경로로 구성됩니다.
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ baseURL: /api 기준

// =======================================================================================
// ✅ 1. 관리자 기반 개발자 평가 전체 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/drating
- 요청 데이터: 없음 (Query String → page, size, keyword, dno)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Page<DratingDto>
*/
export const getDratingList = (token, { page = 1, size = 5, keyword = '', dno = 0 }) => {
    return axios.get('/drating', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, keyword, dno },
    });
};

// =======================================================================================
// ✅ 2. 관리자 기반 개발자 평가 상세 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/admin/drating/detail?drno={drno}
- 요청 파라미터: drno (Query Param)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: DratingDto
*/
export const getDratingDetail = (token, drno) => {
    return axios.get(`/admin/drating/detail?drno=${drno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 3. 관리자 기반 개발자 평가 수정
/*
- 매핑 방식: PUT
- 요청 URL: /api/drating
- 요청 데이터: DratingDto (JSON)
- 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
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
// ✅ 4. 관리자 기반 개발자 평가 삭제
/*
- 매핑 방식: PUT (논리 삭제 또는 보안상 이유로 PUT 사용)
- 요청 URL: /api/admin/drating/delete?drno={drno}
- 요청 파라미터: drno (Query Param)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Boolean (true: 성공, false: 실패)
*/
export const deleteDrating = (token, drno) => {
    return axios.put(`/admin/drating/delete?drno=${drno}`, null, {
        headers: { Authorization: `Bearer ${token}` },
    });
};