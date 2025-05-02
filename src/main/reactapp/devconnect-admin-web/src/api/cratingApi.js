// cratingApi.js | rw 25-05-01 (확장 완료)
// [설명] 기업 평가(Crating) 관련 관리자용 API 호출

import axios from './axiosInstance';

// ✅ 1. 기업 평가 전체 조회 (페이징 포함)
export const getCratingList = (page = 1, size = 100) =>
    axios.get(`/crating?page=${page}&size=${size}`);

// ✅ 1-2. 기업 평가 개별 조회
export const getCratingDetail = (crno, token) =>
    axios.get(`/crating/view?crno=${crno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 2. 평가 승인 (crstate 상태코드 변경)
export const approveCrating = (crno, token) =>
    axios.put(`/crating/approve?crno=${crno}`, null, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 3. 평가 수정
export const updateCrating = (token, cratingDto) =>
    axios.put('/crating', cratingDto, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 4. 평가 삭제
export const deleteCrating = (crno, token) =>
    axios.delete(`/crating?crno=${crno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
