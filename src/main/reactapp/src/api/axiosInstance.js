// =======================================================================================
// axiosInstance.js | rw 25-05-02 최종 리팩토링
// [설명]
// - 모든 API 요청에 대해 공통 baseURL 및 Content-Type 설정 적용
// - 요청 시 JWT 토큰을 자동으로 Authorization 헤더에 추가
// - Spring Security 호환성과 유지 보수를 고려한 구조로 작성됨
// =======================================================================================

// ✅ [1] 필수 모듈 import
import axios from 'axios';                      // Axios 기본 라이브러리
import { getToken } from '../utils/tokenUtil.js';  // JWT 토큰 추출 유틸

// =======================================================================================
// ✅ [2] Axios 인스턴스 생성
/*
    baseURL: 모든 API 요청의 공통 접두 경로 설정
    headers: 기본 요청 헤더 Content-Type 지정
    주의사항: 실제 요청 URL에는 /api/ 까지만 포함하고,
             각 api/*.js 파일에서 상대 경로만 덧붙이도록 구성
*/
const instance = axios.create({
    baseURL: 'http://springweb-env.eba-ecxdumxg.ap-northeast-2.elasticbeanstalk.com/api',  // 모든 요청은 /api 하위에서 전송됨
    headers: {
        'Content-Type': 'application/json',  // 기본 JSON 전송 형식
    },
});

// =======================================================================================
// ✅ [3] 요청 인터셉터 설정
/*
    - 요청 시마다 로컬스토리지에 저장된 토큰을 자동으로 헤더에 삽입
    - 토큰이 없을 경우 Authorization 생략 → Spring Security 예외 방지
*/
instance.interceptors.request.use(
    (config) => {
        const token = getToken(); // JWT 토큰 로드
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =======================================================================================
// ✅ [4] 응답 인터셉터 (401 처리 추가)
/*
    - 인증 실패(401) 발생 시: 토큰 삭제 → 로그인 페이지 강제 이동
*/
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // 1. 토큰 제거
            localStorage.removeItem('accessToken');

            // 2. 로그인 페이지로 강제 이동
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

// =======================================================================================
// ✅ [5] Axios 인스턴스 export
/*
    - 각 API 모듈에서 import 하여 공통 인스턴스 사용
    - ex) import axios from './axiosInstance';
*/
export default instance;