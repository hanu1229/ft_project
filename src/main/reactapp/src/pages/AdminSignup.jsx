// AdminSignup.jsx | rw 25-04-30
// [설명] 새로운 관리자 회원가입 화면입니다.
//        아이디, 비밀번호, 이름, 전화번호를 입력받아 서버에 회원가입 요청을 보냅니다.

import React, { useState } from "react";                           // [1] React 상태 관리 훅 import
import { useNavigate } from "react-router-dom";                    // [2] 페이지 이동을 위한 훅
import { adminSignup } from "../api/adminApi";                     // [3] 관리자 회원가입 API

export default function AdminSignup() {
    const [adid, setAdid] = useState("");                          // [A] 관리자 ID 입력 상태
    const [adpwd, setAdpwd] = useState("");                        // [B] 비밀번호 입력 상태
    const [adname, setAdname] = useState("");                      // [C] 이름 입력 상태
    const [adphone, setAdphone] = useState("");                    // [D] 전화번호 입력 상태
    const navigate = useNavigate();                                // [E] 페이지 이동 함수

    // =======================================================================================
    // [1] 회원가입 요청 처리 함수
    const handleSignup = async () => {
        // (1) 모든 필드 입력값 유효성 검사
        if (!adid || !adpwd || !adname || !adphone) {
            alert("모든 항목을 입력하세요.");
            return;
        }

        try {
            const res = await adminSignup({ adid, adpwd, adname, adphone }); // (2) 서버에 회원가입 요청
            if (res.data === true) {
                alert("회원가입 성공! 로그인 페이지로 이동합니다.");
                navigate("/admin/login");                                 // (3) 로그인 페이지로 이동
            }
        } catch (err) {
            // (4) 에러 발생 시 메시지 출력
            alert("회원가입 실패: " + (err.response?.data?.message || "서버 오류"));
        }
    };

    // =======================================================================================
    // [2] 화면 렌더링 (입력창 + 버튼)
    return (
        <div>
            <h2>관리자 회원가입</h2>

            {/* [1] 아이디 입력 */}
            <input
                value={adid}
                onChange={(e) => setAdid(e.target.value)}
                placeholder="아이디"
            />

            {/* [2] 비밀번호 입력 */}
            <input
                type="password"
                value={adpwd}
                onChange={(e) => setAdpwd(e.target.value)}
                placeholder="비밀번호"
            />

            {/* [3] 이름 입력 */}
            <input
                value={adname}
                onChange={(e) => setAdname(e.target.value)}
                placeholder="이름"
            />

            {/* [4] 전화번호 입력 */}
            <input
                value={adphone}
                onChange={(e) => setAdphone(e.target.value)}
                placeholder="전화번호"
            />

            {/* [5] 회원가입 버튼 */}
            <button onClick={handleSignup}>회원가입</button>
        </div>
    );
}