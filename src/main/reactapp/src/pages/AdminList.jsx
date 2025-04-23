import { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminList() {
    const [adminList, setAdminList] = useState([]);

    // [1] 전체 관리자 목록 불러오기
    const fetchAdmins = async () => {
        try {
            const res = await axios.get('http://localhost:8080/admin/allinfo');
            setAdminList(res.data);
        } catch (err) {
            console.error('조회 실패', err);
            alert('전체 조회 중 오류');
        }
    };

    // [2] 삭제 요청 처리
    const handleDelete = async (adid) => {
        const confirm = window.confirm(`${adid} 관리자 정보를 삭제하시겠습니까?`);
        if (!confirm) return;

        try {
            const res = await axios.put(`http://localhost:8080/admin/delete?adid=${adid}`);
            if (res.data) {
                alert('삭제 처리 완료');
                fetchAdmins(); // 삭제 후 목록 갱신
            } else {
                alert('삭제 실패: 관리자 없음');
            }
        } catch (err) {
            console.error('삭제 오류', err);
            alert('삭제 요청 중 오류');
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    return (
        <div>
            <h2>관리자 전체 목록</h2>
            <table border="1">
                <thead>
                <tr>
                    <th>아이디</th>
                    <th>이름</th>
                    <th>전화번호</th>
                    <th>상태</th>
                    <th>생성일</th>
                    <th>삭제</th>
                </tr>
                </thead>
                <tbody>
                {adminList.map((admin, index) => (
                    <tr key={index}>
                        <td>{admin.adid}</td>
                        <td>{admin.adname}</td>
                        <td>{admin.adphone}</td>
                        <td>{admin.adtype}</td>
                        <td>{admin.createAt}</td>
                        <td>
                            <button onClick={() => handleDelete(admin.adid)}>삭제</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}