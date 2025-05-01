// projectApi.js | rw 25-05-01 (최종 정리본)
// [설명] 프로젝트(Project) 관련 관리자 전용 API 요청 함수 모음

import axios from './axiosInstance';

// ✅ 1. 전체 프로젝트 목록 조회
export const getProjectList = () => axios.get('/project');

// ✅ 2. 프로젝트 상세 조회 (관리자 확인용)
export const getProjectDetail = (pno) => axios.get(`/project/detail?pno=${pno}`);

// ✅ 3. 프로젝트 직권 수정 (관리자 전용)
export const updateProject = (token, projectDto) =>
    axios.put('/project', projectDto, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 4. 프로젝트 직권 삭제 (관리자 전용)
export const deleteProject = (pno, token) =>
    axios.delete(`/project?pno=${pno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });