import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminSignup } from "../api/adminApi";     // [api/adminApi.js] 참고

export default function AdminSignup() {
    const [adid, setAdid] = useState("");
    const [adpwd, setAdpwd] = useState("");
    const [adname, setAdname] = useState("");
    const [adphone, setAdphone] = useState("");
    const navigate = useNavigate();  // 페이지 이동용

    const handleSignup = async () => {
        if (!adid || !adpwd || !adname || !adphone) {
            alert("모든 항목을 입력하세요.");
            return;
        }

        try {
            const res = await adminSignup({ adid, adpwd, adname, adphone });
            if (res.data === true) {
                alert("회원가입 성공! 로그인 페이지로 이동합니다.");
                navigate("/admin/login");    // 회원가입 성공하면 로그인 페이지로 이동
            }
        } catch (err) {
            alert("회원가입 실패: " + (err.response?.data?.message || "서버 오류"));
        }
    };

    return (
        <div>
            <h2>관리자 회원가입</h2>
            <input value={adid} onChange={(e) => setAdid(e.target.value)} placeholder="아이디" />
            <input type="password" value={adpwd} onChange={(e) => setAdpwd(e.target.value)} placeholder="비밀번호" />
            <input value={adname} onChange={(e) => setAdname(e.target.value)} placeholder="이름" />
            <input value={adphone} onChange={(e) => setAdphone(e.target.value)} placeholder="전화번호" />
            <button onClick={handleSignup}>회원가입</button>
        </div>
    );
}