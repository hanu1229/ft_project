// projectApi.js | rw 25-05-02 최종 리팩토링
// [설명] 프로젝트(Project) 관련 API 요청 함수 모음
//        - 관리자 전용 등록, 수정, 삭제 기능 포함
//        - 모든 요청은 공통 axios 인스턴스를 통해 처리됨

import axios from './axiosInstance'; // ✅ 공통 Axios 인스턴스 사용

// =======================================================================================
// ✅ 1. 프로젝트 등록
/*
    매핑 방식: POST
    요청 URL: /api/project
    요청 데이터: ProjectDto (FormData)
    요청 헤더: Authorization: Bearer {token}, Content-Type: multipart/form-data
    응답 데이터: Boolean
*/
export const createProject = (token, formData) => {
    return axios.post('/project', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

// =======================================================================================
// ✅ 2. 전체 프로젝트 목록 조회
/*
    매핑 방식: GET
    요청 URL: /api/project
    요청 파라미터: 없음
    응답 데이터: List<ProjectDto>
*/
export const getProjectList = () => {
    return axios.get('/project');
};

// =======================================================================================
// ✅ 3. 페이징된 프로젝트 목록 조회
/*
    매핑 방식: GET
    요청 URL: /api/project/paging?page=0&size=5
    요청 파라미터: page, size (QueryParam)
    응답 데이터: List<ProjectDto>
*/
export const getPagingProjects = (page = 0, size = 5) => {
    return axios.get('/project/paging', {
        params: { page, size },
    });
};

// =======================================================================================
// ✅ 4. 프로젝트 상세 조회
/*
    매핑 방식: GET
    요청 URL: /api/project/detail?pno={pno}
    요청 파라미터: pno (프로젝트 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: ProjectDto
*/
export const getProjectDetail = (token, pno) => {
    return axios.get('/project/detail', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pno },
    });
};

// =======================================================================================
// ✅ 5. 프로젝트 수정 요청
/*
    매핑 방식: PUT
    요청 URL: /api/project
    요청 데이터: ProjectDto (RequestBody)
    요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    응답 데이터: Boolean
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
// ✅ 6. 프로젝트 삭제 요청
/*
    매핑 방식: DELETE
    요청 URL: /api/project?pno={pno}
    요청 파라미터: pno (프로젝트 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: Boolean
*/
export const deleteProject = (token, pno) => {
    return axios.delete('/project', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pno },
    });
};