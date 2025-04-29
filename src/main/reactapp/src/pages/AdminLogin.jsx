import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../api/adminApi";
import { saveToken } from "../utils/tokenUtil";

export default function AdminLogin() {
    const [adid, setAdid] = useState("");
    const [adpwd, setAdpwd] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await adminLogin({ adid, adpwd });
            saveToken(res.data);
            alert("로그인 성공");
            navigate("/admin/dashboard");
        } catch (err) {
            console.error(err);  // ✅ 콘솔 로그 출력
            alert("로그인 실패: " + (err.response?.data?.message || err.message || "서버 오류"));
        }
    };

    return (
        <div>
            <h2>관리자 로그인</h2>
            <input value={adid} onChange={(e) => setAdid(e.target.value)} placeholder="아이디" />
            <input type="password" value={adpwd} onChange={(e) => setAdpwd(e.target.value)} placeholder="비밀번호" />
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
}