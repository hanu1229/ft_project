// tokenUtil.js | rw 25-05-01 수정
// [설명] JWT 토큰 관련 유틸 함수 모음
//        - 토큰 저장, 조회, 삭제, 역할(Role) 추출 기능 포함
//        - 로컬 스토리지를 활용한 인증 정보 관리

import { jwtDecode } from 'jwt-decode';

// =======================================================================================
// ✅ [1] 토큰 저장 함수
// - 로그인 성공 시 받은 토큰을 localStorage에 저장
// - 저장 키는 'token' 고정
export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

// =======================================================================================
// ✅ [2] 토큰 조회 함수
// - 저장된 토큰을 localStorage에서 꺼내오기
// - 토큰이 없으면 null 반환
export const getToken = () => {
    return localStorage.getItem('token');
};

// =======================================================================================
// ✅ [3] 토큰 삭제 함수
// - 로그아웃 시 localStorage에서 토큰 제거
export const removeToken = () => {
    localStorage.removeItem('token');
};

// =======================================================================================
// ✅ [4] 사용자 역할(Role) 추출 함수
// - 저장된 토큰에서 payload를 파싱하여 'role' 값 반환
// - 예: Admin / Company / Developer
// - 토큰이 없거나 파싱 실패 시 null 반환
export const getUserRole = () => {
    try {
        const token = localStorage.getItem('token'); // 토큰 조회
        if (!token) return null;

        const decoded = jwtDecode(token);            // 토큰 디코딩
        return decoded.role || null;                 // role 필드 반환
    } catch (err) {
        return null; // 파싱 오류 시 null
    }
};