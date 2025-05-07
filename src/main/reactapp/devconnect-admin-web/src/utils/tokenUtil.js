// =======================================================================================
// tokenUtil.js | rw 25-05-02 최종 리팩토링
// [설명]
// - JWT 토큰 저장/조회/삭제 및 디코딩 유틸 함수 모음
// - 관리자 인증 기반 localStorage 방식 사용
// - jwt-decode로 role, id, 권한 등 추출 가능
// =======================================================================================

import { jwtDecode } from 'jwt-decode'; // ✅ JWT 디코딩 라이브러리

const TOKEN_KEY = 'token'; // ✅ localStorage 저장 키

// =======================================================================================
// ✅ [1] 토큰 저장 함수
// - 로그인 성공 후 JWT를 localStorage에 저장
// =======================================================================================
export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// =======================================================================================
// ✅ [2] 토큰 조회 함수
// - 현재 로그인된 사용자의 JWT를 가져옴
// =======================================================================================
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// =======================================================================================
// ✅ [3] 토큰 삭제 함수
// - 로그아웃 시 localStorage에서 토큰 제거
// =======================================================================================
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// =======================================================================================
// ✅ [4] 사용자 권한(Role) 추출 함수
// - 토큰이 존재하고, 유효하면 role 또는 adtype 추출
// - ex) "Admin", "Company", "Developer" 중 하나
// =======================================================================================
export const getUserRole = () => {
    try {
        const token = getToken();
        if (!token) return null;

        const decoded = jwtDecode(token);
        return decoded.role ?? decoded.adtype ?? null;
    } catch (err) {
        console.error('❗ 토큰 디코딩 실패 (getUserRole):', err);
        return null;
    }
};

// =======================================================================================
// ✅ [5] 사용자 ID 추출 함수
// - 관리자 ID(adid) 또는 일반 ID(id) 값 추출
// =======================================================================================
export const getUserId = () => {
    try {
        const token = getToken();
        if (!token) return null;

        const decoded = jwtDecode(token);
        return decoded.adid ?? decoded.id ?? null;
    } catch (err) {
        console.error('❗ 토큰 디코딩 실패 (getUserId):', err);
        return null;
    }
};