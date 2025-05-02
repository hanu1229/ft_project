// developerApi.js | rw 25-05-01 (정리 완료)
// [설명] 개발자 관련 API 요청 함수 모음

import axios from './axiosInstance';

// ✅ 1. 전체 개발자 조회
export const getDeveloperList = () => axios.get('/developer/findall');

// ✅ 1-2. 개발자 개별 조회
export const getDeveloperDetail = (token) =>
    axios.get('/developer/info', {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 2. 개발자 상태코드 변경 (가입 승인 등)
export const updateDeveloperState = (token, data) =>
    axios.put('/developer/state', data, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 3. 개발자 정보 직권 수정 (관리자 전용)
export const updateDeveloper = (token, developerDto) =>
    axios.put('/developer/update', developerDto, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 4. 개발자 직권 삭제 (관리자 전용)
export const deleteDeveloper = (dno, token) =>
    axios.delete(`/developer?dno=${dno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });