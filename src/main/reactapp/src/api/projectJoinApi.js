// =======================================================================================
// projectJoinApi.js | rw 25-05-09 요청 주석 스타일 통일 최종본
// [설명]
// - 프로젝트 신청(ProjectJoin) 관련 관리자 및 기업/개발자 전용 API 요청 함수 모음
// - 모든 요청은 공통 axiosInstance + tokenUtil 기반으로 처리됨
// =======================================================================================

import axios from './axiosInstance.js';
import { getToken } from '../utils/tokenUtil';

// =======================================================================================
// ✅ 1. 프로젝트참여 전체조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /admin/project-join/alljoin
    - 요청 파라미터: (없음)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: ProjectJoinDto[]
*/
export const getProjectJoinList = () => {
    return axios.get('/admin/project-join/alljoin', {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};

// =======================================================================================
// ✅ 2. 프로젝트참여 상세조회 (관리자 전용)
/*
    - 매핑 방식: GET
    - 요청 URL: /admin/project-join/detail?pjno={pjno}
    - 요청 파라미터: pjno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: ProjectJoinDto
*/
export const getProjectJoinDetail = (pjno) => {
    return axios.get(`/admin/project-join/detail?pjno=${pjno}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
    });
};

// =======================================================================================
// ✅ 3. 프로젝트 신청 상태 수정 (기업)
/*
    - 매핑 방식: PUT
    - 요청 URL: /project-join
    - 요청 파라미터: (없음) - body에 ProjectJoinDto 포함
    - 요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    - 응답 데이터: Boolean
*/
export const updateProjectJoin = (projectJoinDto) => {
    return axios.put('/project-join', projectJoinDto, {
        headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 4. 프로젝트 신청 삭제 (관리자)
/*
    - 매핑 방식: DELETE
    - 요청 URL: /project-join?pjno={pjno}
    - 요청 파라미터: pjno (QueryParam)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean
*/
export const deleteProjectJoin = (pjno) => {
    return axios.delete('/project-join', {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: { pjno },
    });
};

// =======================================================================================
// ✅ 5. 개발자 본인의 프로젝트 신청 내역 조회 (개발자)
/*
    - 매핑 방식: GET
    - 요청 URL: /project-join/findall
    - 요청 파라미터: pno, page, size, keyword (QueryParam, optional)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Page<ProjectJoinDto>
*/
export const getMyProjectJoins = ({ pno, page = 1, size = 5, keyword = '' }) => {
    return axios.get('/project-join/findall', {
        headers: { Authorization: `Bearer ${getToken()}` },
        params: { pno, page, size, keyword },
    });
};