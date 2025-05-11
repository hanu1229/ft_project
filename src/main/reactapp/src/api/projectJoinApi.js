// =======================================================================================
// projectJoinApi.js | rw 25-05-10 최종 리팩토링
// [설명]
// - 프로젝트참여(ProjectJoin)는 개발자가 프로젝트에 지원한 내역입니다.
// - 관리자 권한으로 전체조회, 상세조회, 수정, 삭제만 수행합니다.
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 인스턴스 (baseURL = /api)

// =======================================================================================
// ✅ 1. 프로젝트참여 전체 조회
/*
- 매핑 방식: GET
- 요청 URL: /admin/project-join/alljoin
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: List<ProjectJoinDto>
*/
export const getAllProjectJoins = (token) => {
    return axios.get('/admin/project-join/alljoin', {
        headers: { Authorization: `Bearer ${token}` }
    });
};

// =======================================================================================
// ✅ 2. 프로젝트참여 상세 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/admin/project-join/detail?pjno={pjno}
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: ProjectJoinDto
*/
export const getProjectJoinDetail = (token, pjno) => {
    return axios.get(`/admin/project-join/detail?pjno=${pjno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 3. 관리자 기반 프로젝트참여 수정 API (@RequestBody 방식)
// =======================================================================================
/*
- 매핑 방식: PUT
- 요청 URL: /api/admin/project-join/update
- 요청 데이터: ProjectJoinDto (JSON)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Boolean
*/

export const updateProjectJoin = (token, data) => {
    return axios.put('/admin/project-join/update', data, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 4. 프로젝트참여 삭제
/*
- 매핑 방식: DELETE
- 요청 URL: /api/admin/project-join/delete?pjno={pjno}
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Boolean
*/
export const deleteProjectJoin = (token, pjno) => {
    return axios.delete('/admin/project-join/delete', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pjno },
    });
};