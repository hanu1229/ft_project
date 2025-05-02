// vite.config.js | rw 25-05-02 최종 리팩토링
// [설명] Vite 개발 서버 설정 파일
//        - React 플러그인 활성화
//        - 개발 중 CORS 문제 해결을 위한 프록시 설정 포함

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], // ✅ React 플러그인 등록
  server: {
    proxy: {
      // =======================================================================================
      // ✅ /api로 시작하는 요청 → http://localhost:8080 (Spring Boot 백엔드)로 프록시 처리
      /*
          예: axios.get('/api/admin/login') → 실제 요청: http://localhost:8080/api/admin/login
          프론트엔드와 백엔드가 다른 포트일 경우 CORS 오류 방지 역할
      */
      '/api': {
        target: 'http://localhost:8080', // ✅ 백엔드 주소
        changeOrigin: true,              // ✅ 헤더의 origin을 백엔드 주소로 바꿔줌
        secure: false                    // ✅ https가 아닌 http도 허용
      },
    },
  },
});
