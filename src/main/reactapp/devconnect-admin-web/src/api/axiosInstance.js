// =======================================================================================
// axiosInstance.js | rw 25-05-02 최종 리팩토링
// [설명]
// - 모든 API 요청에 대해 공통 baseURL 및 Content-Type 설정 적용
// - 요청 시 JWT 토큰을 자동으로 Authorization 헤더에 추가
// - Spring Security 호환성과 유지 보수를 고려한 구조로 작성됨
// =======================================================================================

// ✅ [1] 필수 모듈 import
import axios from 'axios';                     // Axios 라이브러리
import { getToken } from '../utils/tokenUtil'; // JWT 토큰 유틸 함수

// =======================================================================================
// ✅ [2] Axios 인스턴스 생성
// - baseURL: 모든 API 요청의 공통 prefix 지정
// - headers: 기본 Content-Type을 JSON으로 설정
// =======================================================================================
const instance = axios.create({
    baseURL: 'http://localhost:8080/api',        // [공통 prefix] 모든 API는 /api 하위에서 동작
    headers: {
        'Content-Type': 'application/json',     // [기본] JSON 요청 처리
    },
});

// =======================================================================================
// ✅ [3] 요청 인터셉터 설정
// - 매 요청마다 로컬스토리지에 저장된 JWT 토큰을 Authorization 헤더에 자동 삽입
// - 토큰이 없을 경우 Authorization 헤더를 생략하여 Spring Security 오류 방지
// =======================================================================================
instance.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =======================================================================================
// ✅ [4] 인스턴스 export
// - 각 api/*.js 파일에서 import 하여 사용 가능
// =======================================================================================
export default instance;