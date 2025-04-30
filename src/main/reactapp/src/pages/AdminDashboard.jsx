// AdminDashboard.jsx | rw 25-04-30
// [설명] 로그인된 관리자의 정보를 표시하는 대시보드 화면입니다.
//        JWT 토큰 기반으로 인증 요청을 보내고, 성공 시 관리자 정보를 화면에 출력합니다.

import React, { useEffect, useState } from "react";                    // [1] 리액트 기본 훅 import
import { getAdminInfo, logoutAdmin } from "../api/adminApi";          // [2] 관리자 정보 조회 / 로그아웃 API
import { getToken, removeToken } from "../utils/tokenUtil";           // [3] 토큰 저장/삭제 유틸
import { useNavigate } from "react-router-dom";                       // [4] 페이지 이동을 위한 훅

export default function AdminDashboard() {
    const [admin, setAdmin] = useState(null);                        // [A] 관리자 정보 저장 상태값
    const navigate = useNavigate();                                  // [B] 페이지 이동 함수
    const token = getToken();                                        // [C] 현재 로컬스토리지에 저장된 JWT 토큰

    // =======================================================================================
    // [1] 컴포넌트 마운트 시 관리자 정보 조회
    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const res = await getAdminInfo(token);               // (1) 토큰으로 관리자 정보 요청
                setAdmin(res.data);                                  // (2) 조회 성공 시 상태값에 저장
            } catch (err) {
                alert("인증 실패. 다시 로그인하세요.");              // (3) 실패 시 경고창
                removeToken();                                       // (4) 로컬 토큰 제거
                navigate("/admin/login");                            // (5) 로그인 페이지로 이동
            }
        };
        fetchAdminInfo();                                            // (6) 함수 실행
    }, [token, navigate]);                                           // ✅ token 또는 navigate가 변경되면 재실행

    // =======================================================================================
    // [2] 로그아웃 처리 함수
    const handleLogout = async () => {
        await logoutAdmin(token);                                    // (1) 서버에 로그아웃 요청
        removeToken();                                               // (2) 클라이언트 토큰 제거
        navigate("/admin/login");                                    // (3) 로그인 페이지로 이동
    };

    // =======================================================================================
    // [3] 관리자 정보 수정 페이지로 이동
    const goToUpdatePage = () => {
        navigate("/admin/update");                                   // 관리자 수정 폼으로 이동
    };

    // =======================================================================================
    // [4] 아직 관리자 정보가 로딩되지 않았다면 로딩 메시지 출력
    if (!admin) return <p>로딩 중...</p>;

    // =======================================================================================
    // [5] 대시보드 화면 렌더링
    return (
        <div>
            <h2>관리자 대시보드</h2>
            <p><strong>아이디:</strong> {admin.adid}</p>
            <p><strong>이름:</strong> {admin.adname}</p>
            <p><strong>전화번호:</strong> {admin.adphone}</p>

            <button onClick={goToUpdatePage}>정보 수정하기</button>  {/* 관리자 수정 버튼 */}
            <button onClick={handleLogout}>로그아웃</button>         {/* 로그아웃 버튼 */}
        </div>
    );
}