// projectJoinApi.js | rw 25-05-02 최종 리팩토링
// [설명]
// - 프로젝트 신청(ProjectJoin) 관련 관리자 및 기업/개발자 전용 API 요청 함수 모음
// - 모든 요청은 axiosInstance를 통해 처리되며, baseURL: '/api' 기준으로 작성됨

import axios from './axiosInstance'; // ✅ 공통 Axios 인스턴스 사용

// =======================================================================================
// ✅ 1. 프로젝트 신청 등록 (개발자)
/*
    - 매핑 방식: POST
    - 요청 URL: /project_join
    - 요청 파라미터: pno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const createProjectJoin = (token, pno) => {
    return axios.post(`/project_join?pno=${pno}`, null, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 2. 기업이 등록한 공고에 대한 신청 목록 조회 (기업)
/*
    - 매핑 방식: GET
    - 요청 URL: /project_join
    - 요청 파라미터: pno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: List<ProjectJoinDto>
*/
export const getProjectJoinList = (token, pno) => {
    return axios.get('/project_join', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pno },
    });
};

// =======================================================================================
// ✅ 3. 프로젝트 신청 상태 수정 (기업)
/*
    - 매핑 방식: PUT
    - 요청 URL: /project_join
    - 요청 데이터: ProjectJoinDto (pjno, pjtype 등 포함)
    - 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    - 응답 데이터: Boolean
*/
export const updateProjectJoin = (token, projectJoinDto) => {
    return axios.put('/project_join', projectJoinDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 4. 프로젝트 신청 삭제 (관리자)
/*
    - 매핑 방식: DELETE
    - 요청 URL: /project_join?pjno={pjno}
    - 요청 파라미터: pjno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteProjectJoin = (token, pjno) => {
    return axios.delete('/project_join', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pjno },
    });
};

// =======================================================================================
// ✅ 5. 개발자 본인의 프로젝트 신청 내역 조회 (개발자)
/*
    - 매핑 방식: GET
    - 요청 URL: /project_join/findall
    - 요청 파라미터: pno, page, size, keyword (QueryParam, optional)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Page<ProjectJoinDto>
*/
export const getMyProjectJoins = (token, { pno, page = 1, size = 5, keyword = '' }) => {
    return axios.get('/project_join/findall', {
        headers: { Authorization: `Bearer ${token}` },
        params: { pno, page, size, keyword },
    });
};