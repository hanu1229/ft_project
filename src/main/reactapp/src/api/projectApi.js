// =======================================================================================
// projectApi.js | rw 25-05-10 최종 리팩토링
// [설명]
// - 프로젝트(Project)는 기업이 등록한 과제이며, 관리자 권한으로만 접근 가능합니다.
// - 전체 조회, 상세 조회, 수정, 삭제 API만 구현되었습니다.
// - 모든 요청은 공통 인스턴스 axiosInstance.js(baseURL = '/api') 기준으로 구성됩니다.
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 인스턴스 (baseURL = /api)

// =======================================================================================
// ✅ 1. 프로젝트 전체 조회
/*
- 매핑 방식: GET
- 요청 URL: /project
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: List<ProjectDto>
*/
export const getProjectList = (token) => {
    return axios.get('/project', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// =======================================================================================
// ✅ 2. 프로젝트 상세 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/admin/project/detail?pno={pno}
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: ProjectDto
*/
export const getProjectDetail = (token, pno) => {
    return axios.get(`/admin/project/detail?pno=${pno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 3. 프로젝트 수정
/*
- 매핑 방식: PUT
- 요청 URL: /api/project/update
- 요청 데이터: ProjectDto (FormData)
- 요청 헤더: Authorization: Bearer {token}, Content-Type: multipart/form-data
- 응답 데이터: Boolean
*/
export const updateProject = (token, formData) => {
    return axios.put('/project/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

// =======================================================================================
// ✅ 4. 프로젝트 삭제
/*
- 매핑 방식: DELETE (실제 삭제 방식)
- 요청 URL: /api/admin/project/delete?pno={pno}
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Boolean
*/
export const deleteProject = (token, pno) => {
    return axios.delete(`/admin/project/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pno },
    });
};