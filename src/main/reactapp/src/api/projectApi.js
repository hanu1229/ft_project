// projectApi.js | rw 25-05-02 최종 리팩토링
// [설명]
// - 프로젝트(Project) 관련 관리자 및 기업 전용 API 요청 함수 모음
// - 모든 요청 URL은 axiosInstance.js의 baseURL(/api)을 기준으로 작성됨

import axios from './axiosInstance.js'; // ✅ 공통 Axios 인스턴스 사용



// =======================================================================================
// ✅ 프로젝트 전체조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /api/project
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: ProjectDto[] (전체 목록)
*/
export const getProjectList = (token) => {
    return axios.get('/project', {
        headers: { Authorization: `Bearer ${token}` }
    });
};



// =======================================================================================
// ✅ 프로젝트 상세 조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /admin/project/detail?pno={pno}
    - 요청 파라미터: pno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: ProjectDto
*/
export const getProjectDetail = (token, pno) => {
    return axios.get(`/admin/project/detail?pno=${pno}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// =======================================================================================
// ✅ 6. 프로젝트 수정 요청 (기업 전용)
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/project
    - 요청 데이터: ProjectDto (RequestBody)
    - 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    - 응답 데이터: Boolean
*/
export const updateProject = (token, projectDto) => {
    return axios.put('/project', projectDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 7. 프로젝트 삭제 요청 (기업/관리자)
/*
    - 매핑 방식: DELETE
    - 요청 URL: /api/project?pno={pno}
    - 요청 파라미터: pno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteProject = (token, pno) => {
    return axios.delete('/project', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pno },
    });
};