// =======================================================================================
// main.jsx | rw 25-05-02 (Vite 기반 진입점 파일)
// [설명]
// - React 애플리케이션의 최상위 컴포넌트(App)를 HTML 루트(#root)에 마운트합니다.
// - React 18 이후의 createRoot 방식 사용
// - 반드시 <BrowserRouter>로 감싸야 App 내부 <Routes> 사용 가능
// =======================================================================================

// ✅ [1] React 및 DOM 관련 모듈 import
import React from 'react';
import ReactDOM from 'react-dom/client';

// ✅ [2] 최상위 컴포넌트 import
import App from './App.jsx';

// ✅ [3] 전역 스타일 (검정 배경, 핑크 텍스트 등)
import './index.css';

// ✅ [4] 리액트 라우팅을 위한 BrowserRouter import
import { BrowserRouter } from 'react-router-dom';

// ✅ [5] 루트 DOM 요소를 기준으로 렌더링 수행
const rootElement = document.getElementById('root');
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        {/* ✅ 모든 라우팅을 BrowserRouter로 감싸야 useRoutes() 사용 가능 */}
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </React.StrictMode>
);