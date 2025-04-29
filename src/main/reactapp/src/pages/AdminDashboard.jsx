import React, { useEffect, useState } from "react";
import { getAdminInfo, logoutAdmin } from "../api/adminApi";
import { getToken, removeToken } from "../utils/tokenUtil";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();
    const token = getToken();

    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const res = await getAdminInfo(token);
                setAdmin(res.data);
            } catch (err) {
                alert("인증 실패. 다시 로그인하세요.");
                removeToken();
                navigate("/admin/login");
            }
        };
        fetchAdminInfo();
    }, [token, navigate]);

    const handleLogout = async () => {
        await logoutAdmin(token);
        removeToken();
        navigate("/admin/login");
    };

    const goToUpdatePage = () => {
        navigate("/admin/update");    //  (수정페이지 이동)
    };

    if (!admin) return <p>로딩 중...</p>;

    return (
        <div>
            <h2>관리자 대시보드</h2>
            <p><strong>아이디:</strong> {admin.adid}</p>
            <p><strong>이름:</strong> {admin.adname}</p>
            <p><strong>전화번호:</strong> {admin.adphone}</p>

            <button onClick={goToUpdatePage}>정보 수정하기</button> {/*  버튼 추가 */}
            <button onClick={handleLogout}>로그아웃</button>
        </div>
    );
}