// projectJoinApi.js | rw 25-05-02 최종 리팩토링
// [설명] 관리자 전용 프로젝트 신청(ProjectJoin) 관련 API 요청 함수 모음
//        - 승인/수정/삭제 기능 포함
//        - 모든 요청은 공통 axios 인스턴스를 통해 처리

import axios from './axiosInstance'; // ✅ 공통 Axios 인스턴스 사용

// =======================================================================================
// ✅ 1. 전체 신청 목록 조회
/*
    매핑 방식: GET
    요청 URL: /api/project-join
    요청 파라미터: 없음
    응답 데이터: List<ProjectJoinDto>
*/
export const getProjectJoinList = () => {
    return axios.get('/api/project-join');
};

// =======================================================================================
// ✅ 2. 신청 상세 조회
/*
    매핑 방식: GET
    요청 URL: /api/project-join/detail?pjno={pjno}
    요청 파라미터: pjno (신청 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: ProjectJoinDto
*/
export const getProjectJoinDetail = (pjno, token) => {
    return axios.get(`/api/project-join/detail?pjno=${pjno}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

// =======================================================================================
// ✅ 3. 신청 상태 수정
/*
    매핑 방식: PUT
    요청 URL: /api/project-join
    요청 데이터: ProjectJoinDto (pjno, pjtype 등 포함)
    요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    응답 데이터: Boolean
*/
export const updateProjectJoin = (token, projectJoinDto) => {
    return axios.put('/api/project-join', projectJoinDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 4. 신청 삭제 요청
/*
    매핑 방식: DELETE
    요청 URL: /api/project-join?pjno={pjno}
    요청 파라미터: pjno (신청 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: Boolean
*/
export const deleteProjectJoin = (pjno, token) => {
    return axios.delete(`/api/project-join?pjno=${pjno}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};