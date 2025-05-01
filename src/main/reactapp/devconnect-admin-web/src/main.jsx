// main.jsx | Vite 기반 진입점
// [설명] React 애플리케이션의 진입점으로, 최상위 App 컴포넌트를 DOM에 렌더링합니다.
//        - React 18 방식의 createRoot 사용
//        - Vite에서는 이 파일을 기본 entry point로 인식합니다.

import React from 'react'; // [1] React 컴포넌트 구문 지원을 위한 기본 import
import ReactDOM from 'react-dom/client'; // [2] React 18의 새로운 root 렌더링 API 사용
import App from './App'; // [3] 최상위 컴포넌트(App.jsx) import
import './index.css'; // [4] 전체 앱에 적용할 기본 CSS import

// [5] 루트 DOM 요소(#root)를 기준으로 App 컴포넌트 렌더링
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode> {/* [6] 개발 모드에서 자식 컴포넌트 검사 강화 */}
        <App /> {/* [7] 실제 전체 화면을 담당하는 컴포넌트 */}
    </React.StrictMode>
);