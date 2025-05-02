// companyApi.js | rw 25-05-01 (확장 완료)
// [설명] 기업 관련 API 요청 함수 모음

import axios from './axiosInstance';

// ✅ 1. 전체 기업 조회
export const getCompanyList = () => axios.get('/company/findall');

// ✅ 1-2. 개별 기업 정보 조회
export const getCompanyDetail = (token) =>
    axios.get('/company/info', {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 2. 기업 상태코드 변경 (가입 승인 등)
export const updateCompanyState = (token, data) =>
    axios.put('/company/state', data, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 3. 기업 정보 수정 (관리자용)
export const updateCompany = (token, formData) =>
    axios.put('/company/update', formData, {
        headers: { Authorization: `Bearer ${token}` },
    });

// ✅ 4. 기업 삭제 (관리자용 상태 변경 처리)
export const deleteCompany = (cno, token) =>
    axios.delete(`/company/delete?cno=${cno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
