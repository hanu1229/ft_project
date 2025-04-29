import React, { useEffect, useState } from "react";
import { getAdminList, deleteAdmin } from "../api/adminApi";

export default function AdminList() {
    const [admins, setAdmins] = useState([]);

    // 관리자 목록 불러오기
    const loadAdmins = async () => {
        try {
            const res = await getAdminList();
            setAdmins(res.data);
        } catch (err) {
            alert("관리자 목록 조회 실패");
        }
    };

    // 삭제 버튼 클릭 시
    const handleDelete = async (adid) => {
        if (!window.confirm(`정말 ${adid} 관리자 계정을 삭제하시겠습니까?`)) return;

        try {
            await deleteAdmin(adid);
            alert("삭제 완료");
            setAdmins(admins.filter(admin => admin.adid !== adid)); // 즉시 목록 갱신
        } catch (err) {
            alert("삭제 실패");
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    return (
        <div>
            <h2>관리자 목록</h2>
            <table border="1" cellPadding="8">
                <thead>
                <tr>
                    <th>번호</th>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>전화번호</th>
                    <th>삭제</th>
                </tr>
                </thead>
                <tbody>
                {admins.length === 0 ? (
                    <tr><td colSpan="5">데이터가 없습니다.</td></tr>
                ) : (
                    admins.map((admin, idx) => (
                        <tr key={admin.adid}>
                            <td>{idx + 1}</td>
                            <td>{admin.adid}</td>
                            <td>{admin.adname}</td>
                            <td>{admin.adphone}</td>
                            <td>
                                <button onClick={() => handleDelete(admin.adid)}>삭제</button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}
