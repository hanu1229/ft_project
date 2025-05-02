// =======================================================================================
// tokenUtil.js | rw 25-05-02 최종 리팩토링
// [설명]
// - JWT 토큰 관련 유틸 함수 모음
// - localStorage 기반 저장 및 삭제 처리
// - jwt-decode로 사용자 역할(role/adtype) 파싱
// =======================================================================================

import { jwtDecode } from 'jwt-decode'; // ✅ JWT 디코딩용

const TOKEN_KEY = 'token'; // ✅ 고정 키 설정

// =======================================================================================
// ✅ [1] 토큰 저장
// - 로그인 성공 시 받은 JWT를 localStorage에 저장
export const saveToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

// =======================================================================================
// ✅ [2] 토큰 조회
// - localStorage에서 현재 JWT를 가져옴
export const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// =======================================================================================
// ✅ [3] 토큰 삭제
// - 로그아웃 시 호출 (보안상 반드시 제거 필요)
export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

// =======================================================================================
// ✅ [4] 사용자 권한(role) 추출
// - JWT 내부 role 또는 adtype 필드에서 권한 확인
// - 예: Admin / Company / Developer
// - 파싱 실패 또는 미로그인 상태 시 null 반환
export const getUserRole = () => {
    try {
        const token = getToken();
        if (!token) return null;

        const decoded = jwtDecode(token);
        return decoded?.role || decoded?.adtype || null;
    } catch (err) {
        console.error('토큰 파싱 실패:', err);
        return null;
    }
};

// =======================================================================================
// ✅ [5] 사용자 ID 추출 (선택적 사용 가능)
// - 필요 시 로그인된 사용자 식별자(adid 등)를 확인하는 데 사용
export const getUserId = () => {
    try {
        const token = getToken();
        if (!token) return null;

        const decoded = jwtDecode(token);
        return decoded?.adid || decoded?.id || null;
    } catch (err) {
        return null;
    }
};