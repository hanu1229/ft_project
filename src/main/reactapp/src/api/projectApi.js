// =======================================================================================
// projectApi.js | rw 25-05-08 관리자 전용 구조로 리팩토링
// [설명]
// - 프로젝트(Project) 관련 API 요청 함수 모음 (관리자 전용)
// - 모든 요청은 관리자 토큰 기반 인증이 필요하며 CRUD 기능 지원
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 Axios 인스턴스 사용

// =======================================================================================
// ✅ 1. 전체 프로젝트 목록 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/project/all
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: List<ProjectDto>
*/
export const getProjectList = (token) => {
    return axios.get('/project/all', {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 2. 프로젝트 상세 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/project/detail?pno=#
    - 요청 파라미터: pno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: ProjectDto
*/
export const getProjectDetail = (pno, token) => {
    return axios.get(`/project/detail`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pno },
    });
};

// =======================================================================================
// ✅ 3. 프로젝트 등록 (관리자 전용)
/*
    - 매핑 방식: POST
    - 요청 URL: /api/project
    - 요청 데이터: ProjectDto (JSON)
    - 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    - 응답 데이터: Boolean
*/
export const createProject = (token, dto) => {
    return axios.post('/project', dto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
};

// =======================================================================================
// ✅ 4. 프로젝트 수정 (관리자 전용)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/project
    - 요청 데이터: ProjectDto (JSON)
    - 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    - 응답 데이터: Boolean
*/
export const updateProject = (token, dto) => {
    return axios.put('/project', dto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
};

// =======================================================================================
// ✅ 5. 프로젝트 삭제 (관리자 전용)
/*
    - 매핑 방식: DELETE
    - 요청 URL: /api/project/delete?pno=#
    - 요청 파라미터: pno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteProject = (pno, token) => {
    return axios.delete(`/project/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pno },
    });
};
