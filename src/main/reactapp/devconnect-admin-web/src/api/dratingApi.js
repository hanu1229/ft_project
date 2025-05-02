// dratingApi.js | rw 25-05-01 (확장 완료)
// [설명] 개발자 평가(Drating) 관련 관리자용 API 호출

import axios from './axiosInstance';

// ✅ 1. 전체 개발자 평가 목록 조회
export const getDratingList = () => axios.get('/drating');

// ✅ 1-2. 개발자 평가 개별 조회
export const getDratingDetail = (drno, token) =>
    axios.get(`/drating/view?drno=${drno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 2. 평가 승인 (drstate 상태코드 변경)
export const approveDrating = (drno, token) =>
    axios.put(`/drating/approve?drno=${drno}`, null, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 3. 평가 수정
export const updateDrating = (token, dratingDto) =>
    axios.put('/drating', dratingDto, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 4. 평가 삭제
export const deleteDrating = (drno, token) =>
    axios.delete(`/drating?drno=${drno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
