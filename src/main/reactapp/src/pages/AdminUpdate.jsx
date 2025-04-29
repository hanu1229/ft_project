import React, { useState, useEffect } from "react";
import { getAdminInfo, updateAdmin } from "../api/adminApi";
import { getToken } from "../utils/tokenUtil";
import { useNavigate } from "react-router-dom";

export default function AdminUpdate() {
    const [adname, setAdname] = useState("");
    const [adphone, setAdphone] = useState("");
    const navigate = useNavigate();
    const token = getToken();

    // 기존 정보 불러오기
    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const res = await getAdminInfo(token);
                setAdname(res.data.adname);
                setAdphone(res.data.adphone);
            } catch (err) {
                alert("정보 조회 실패");
                navigate("/admin/login");
            }
        };
        fetchAdminInfo();
    }, [token, navigate]);

    // 수정 요청
    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            formData.append("adname", adname);
            formData.append("adphone", adphone);

            const res = await updateAdmin(token, formData);
            if (res.data === true) {
                alert("정보 수정 완료");
                navigate("/admin/dashboard"); // 수정 완료 후 대시보드로 이동
            } else {
                alert("정보 수정 실패");
            }
        } catch (err) {
            alert("정보 수정 에러");
        }
    };

    return (
        <div>
            <h2>관리자 정보 수정</h2>
            <input
                value={adname}
                onChange={(e) => setAdname(e.target.value)}
                placeholder="이름 수정"
            />
            <input
                value={adphone}
                onChange={(e) => setAdphone(e.target.value)}
                placeholder="전화번호 수정"
            />
            <button onClick={handleUpdate}>수정하기</button>
        </div>
    );
}