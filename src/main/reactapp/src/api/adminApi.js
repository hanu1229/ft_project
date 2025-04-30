// adminApi.js | rw 25-04-30
// [설명] 관리자(Admin) 관련 API 요청을 처리하는 모듈입니다.
//        모든 API는 Spring Boot 서버와 연동되며, axios를 사용하여 비동기 통신을 수행합니다.

import axios from "axios"; // [1] axios: HTTP 통신 라이브러리 import

// [2] 공통 URL 설정 - 모든 관리자 API의 기본 URL
const BASE_URL = "http://localhost:8080/api/admin";

// =======================================================================================
// [1] 관리자 로그인 요청 (POST /login)
// - 요청 데이터: { adid, adpwd } 형태의 JSON
// - 응답: JWT 토큰 (String)
export const adminLogin = (data) => axios.post(`${BASE_URL}/login`, data, {
    headers: {
        "Content-Type": "application/json" // 요청 본문 형식 명시 (JSON)
    }
});

// =======================================================================================
// [2] 관리자 회원가입 요청 (POST /signup)
// - 요청 데이터: AdminDto 형태
// - 응답: Boolean (true/false)
export const adminSignup = (data) => axios.post(`${BASE_URL}/signup`, data);

// =======================================================================================
// [3] 관리자 본인 정보 조회 (GET /info)
// - 요청 헤더에 JWT 토큰 포함 (Authorization: Bearer {token})
// - 응답: AdminDto 형태의 본인 정보
export const getAdminInfo = (token) => axios.get(`${BASE_URL}/info`, {
    headers: { Authorization: `Bearer ${token}` } // 인증 토큰 포함
});

// =======================================================================================
// [4] 관리자 정보 수정 (PUT /update)
// - 요청: formData (AdminDto 정보 포함)
// - 응답: Boolean (true/false)
export const updateAdmin = (token, formData) => axios.put(`${BASE_URL}/update`, formData, {
    headers: { Authorization: `Bearer ${token}` } // 인증 토큰 포함
});

// =======================================================================================
// [5] 관리자 전체 목록 조회 (GET /allinfo)
// - 응답: List<AdminDto> (관리자 전체 정보 배열)
export const getAdminList = () => axios.get(`${BASE_URL}/allinfo`);

// =======================================================================================
// [6] 관리자 삭제 요청 (PUT /delete?adid=xxx)
// - 주의: 실제 삭제가 아닌 adtype 상태코드 변경 방식
// - 응답: Boolean (true/false)
export const deleteAdmin = (adid) => axios.put(`${BASE_URL}/delete?adid=${adid}`);

// =======================================================================================
// [7] 관리자 로그아웃 (GET /logout)
// - 요청 헤더에 JWT 토큰 포함
// - 응답: Boolean (true/false) 혹은 메시지
export const logoutAdmin = (token) => axios.get(`${BASE_URL}/logout`, {
    headers: { Authorization: `Bearer ${token}` } // 인증 토큰 포함
});