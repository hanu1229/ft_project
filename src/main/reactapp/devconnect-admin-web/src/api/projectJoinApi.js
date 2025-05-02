// projectJoinApi.js | rw 25-05-01 (정리 완료)
// [설명] 프로젝트 참여(ProjectJoin) 관련 관리자 전용 API 요청 함수 모음

import axios from './axiosInstance';

// ✅ 1. 전체 프로젝트 신청 목록 조회 (관리자 전용)
export const getProjectJoinList = () => axios.get('/project_join/all');

// ✅ 2. 프로젝트 신청 상세 조회 (관리자 전용)
export const getProjectJoinDetail = (pjno, token) =>
    axios.get(`/project_join/view?pjno=${pjno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 3. 프로젝트 신청 수정 (관리자 전용)
export const updateProjectJoin = (token, projectJoinDto) =>
    axios.put('/project_join', projectJoinDto, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 4. 프로젝트 신청 삭제 (관리자 전용)
export const deleteProjectJoin = (pjno, token) =>
    axios.delete(`/project_join?pjno=${pjno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
