// =======================================================================================
// projectApi.js | rw 25-05-11 최종 주석 리팩토링 (관리자 전용 프로젝트 API 모듈)
// [설명]
// - 프로젝트(Project)는 기업이 등록한 과제로, 관리자만 전체 접근 가능합니다.
// - 전체 조회, 상세 조회, 수정, 삭제 기능만 포함됩니다.
// - 모든 요청은 axiosInstance.js의 baseURL(/api) 기준 상대경로로 작성됩니다.
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 인스턴스 (baseURL = /api)

// =======================================================================================
// ✅ 1. 프로젝트 전체 목록 조회 (관리자 전용)
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
// ✅ 2. 프로젝트 상세 조회 (관리자 전용)
/*
- 매핑 방식: GET
- 요청 URL: /admin/project/detail?pno={pno}
- 요청 파라미터: pno (Query String)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: ProjectDto
*/
export const getProjectDetail = (token, pno) => {
    return axios.get(`/admin/project/detail?pno=${pno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 3. 프로젝트 수정 요청 (FormData 전송)
/*
- 매핑 방식: PUT
- 요청 URL: /admin/project/update
- 요청 데이터: ProjectDto (FormData → @ModelAttribute)
- 요청 헤더: Authorization: Bearer {token}, Content-Type: multipart/form-data
- 응답 데이터: Boolean
*/
export const updateProject = (token, formData) => {
    return axios.put('/admin/project/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

// =======================================================================================
// ✅ 4. 프로젝트 삭제 요청 (관리자 직권 삭제)
/*
- 매핑 방식: DELETE
- 요청 URL: /admin/project/delete?pno={pno}
- 요청 파라미터: pno (Query String)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Boolean
*/
export const deleteProject = (token, pno) => {
    return axios.delete(`/admin/project/delete`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { pno },
    });
};