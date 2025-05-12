// =======================================================================================
// cratingApi.js | rw 25-05-02 최종 리팩토링
// [설명]
// - 기업 평가(Crating)는 프로젝트 단위에서 기업의 신뢰도 및 활동 이력을 평가하는 관리자 전용 기능입니다.
// - 모든 요청은 공통 인스턴스(axiosInstance.js)의 baseURL(`/api`) 기준 상대경로로 구성됩니다.
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ baseURL: /api 기준

// =======================================================================================
// ✅ 1. 관리자 기반 기업 평가 전체 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/crating
- 요청 데이터: 없음 (Query String → page, size, keyword, dno)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Page<CratingDto>
*/
export const getCratingList = (token, { page = 1, size = 5, keyword = '', dno = 0 }) => {
    return axios.get('/crating', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size, keyword, dno },
    });
};

// =======================================================================================
// ✅ 2. 관리자 기반 기업 평가 상세 조회
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
// ✅ 3. 관리자 기반 기업 평가 수정 요청 (JSON 전송 방식)
// =======================================================================================
/*
- 매핑 방식: PUT
- 요청 URL: /api/admin/crating/update
- 요청 데이터: CratingDto (application/json 형식)
- 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
- 응답 데이터: Boolean (true = 성공, false = 실패)
- 설명:
    • 관리자 권한으로 기업 평가(crating)를 수정합니다.
    • 수정 가능한 항목: 제목(ctitle), 내용(ccontent), 점수(crscore), 상태코드(crstate)
    • 평가 번호(crno)는 필수이며, FK 정보(pno, dno)는 수정되지 않습니다.
*/
export const updateCrating = (token, cratingDto) => {
    return axios.put('/admin/crating/update', cratingDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 4. 관리자 기반 기업 평가 삭제
/*
- 매핑 방식: PUT (논리 삭제 또는 보안상 이유로 PUT 사용)
- 요청 URL: /api/admin/crating/delete?crno={crno}
- 요청 파라미터: crno (Query Param)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Boolean (true: 성공, false: 실패)
*/
export const deleteCrating = (token, crno) => {
    return axios.put(`/admin/crating/delete?crno=${crno}`, null, {
        headers: { Authorization: `Bearer ${token}` },
    });
};