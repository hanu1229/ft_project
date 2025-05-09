// =======================================================================================
// projectJoinApi.js | rw 25-05-08 리팩토링 - 관리자 전용 구조로 통일
// [설명]
// - 프로젝트 신청 관련 API 요청 함수 모음
// - 모든 요청은 관리자 권한 기준으로 동작하며 JWT 토큰 필요
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 Axios 인스턴스 사용

// =======================================================================================
// ✅ [1]. 프로젝트 신청 등록
/*
    - 매핑 방식: POST
    - 요청 URL: /api/project-join
    - 요청 파라미터: pno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const createProjectJoin = (token, pno) => {
    return axios.post(`/project-join?pno=${pno}`, null, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ [2]. 프로젝트 신청 전체 조회 (pno별 필터링 포함)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/project-join
    - 요청 파라미터: pno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: List<ProjectJoinDto>
*/
export const getProjectJoinByPno = (token, pno) => {
    return axios.get('/project-join', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pno },
    });
};

// =======================================================================================
// ✅ [3]. 프로젝트 신청 전체 페이징 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/project-join/paging
    - 요청 파라미터: pno (optional), page, size (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Page<ProjectJoinDto>
*/
export const getProjectJoinPaging = (token, { pno, page = 0, size = 10 }) => {
    const params = { page, size };
    if (pno !== undefined) params.pno = pno;

    return axios.get('/project-join/paging', {
        headers: { Authorization: `Bearer ${token}` },
        params,
    });
};

// =======================================================================================
// ✅ [4]. 프로젝트 신청 상세 조회
/*
    - 매핑 방식: GET
    - 요청 URL: /api/project-join/detail
    - 요청 파라미터: pjno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: ProjectJoinDto
*/
export const getProjectJoinDetail = (token, pjno) => {
    return axios.get('/project-join/detail', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pjno },
    });
};

// =======================================================================================
// ✅ [5]. 프로젝트 신청 수정
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/project-join
    - 요청 데이터: ProjectJoinDto (pjno, pjtype 등)
    - 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    - 응답 데이터: Boolean
*/
export const updateProjectJoin = (token, dto) => {
    return axios.put('/project-join', dto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ [6]. 프로젝트 신청 삭제
/*
    - 매핑 방식: DELETE
    - 요청 URL: /api/project-join
    - 요청 파라미터: pjno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteProjectJoin = (token, pjno) => {
    return axios.delete('/project-join', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pjno },
    });
};
