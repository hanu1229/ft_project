// AdminList.jsx | rw 25-04-30
// [설명] 전체 관리자 목록을 조회하여 테이블 형식으로 출력하는 화면입니다.
//        삭제 요청 시 상태코드를 변경하여 실제 삭제 대신 논리적 처리 방식 사용

import React, { useEffect, useState } from "react";                    // [1] React 훅 import
import { getAdminList, deleteAdmin } from "../api/adminApi";          // [2] 관리자 목록 조회 / 삭제 API

export default function AdminList() {
    const [admins, setAdmins] = useState([]);                         // [A] 관리자 목록을 저장하는 상태값

    // =======================================================================================
    // [1] 관리자 목록을 서버에서 불러오는 함수
    const loadAdmins = async () => {
        try {
            const res = await getAdminList();                         // (1) 전체 관리자 정보 요청
            setAdmins(res.data);                                      // (2) 응답 데이터를 상태값에 저장
        } catch (err) {
            alert("관리자 목록 조회 실패");                            // (3) 실패 시 알림 출력
        }
    };

    // =======================================================================================
    // [2] 관리자 삭제 요청 함수 (관리자 상태코드 변경 방식)
    const handleDelete = async (adid) => {
        if (!window.confirm(`정말 ${adid} 관리자 계정을 삭제하시겠습니까?`)) return;

        try {
            await deleteAdmin(adid);                                   // (1) 삭제 API 요청
            alert("삭제 완료");                                        // (2) 성공 알림
            setAdmins(admins.filter(admin => admin.adid !== adid));   // (3) 화면에서 바로 삭제 반영
        } catch (err) {
            alert("삭제 실패");                                        // (4) 실패 시 알림
        }
    };

    // =======================================================================================
    // [3] 컴포넌트 마운트 시 관리자 목록 자동 불러오기
    useEffect(() => {
        loadAdmins();                                                 // (1) 페이지 로딩 시 1회 실행
    }, []);

    // =======================================================================================
    // [4] 관리자 목록 테이블 렌더링
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
                    // v 조회된 데이터가 없을 경우
                    <tr><td colSpan="5">데이터가 없습니다.</td></tr>
                ) : (
                    // v 조회된 관리자 목록을 반복 출력
                    admins.map((admin, idx) => (
                        <tr key={admin.adid}>
                            <td>{idx + 1}</td>                        {/* 1번부터 순서 번호 표시 */}
                            <td>{admin.adid}</td>                    {/* 관리자 ID */}
                            <td>{admin.adname}</td>                  {/* 관리자 이름 */}
                            <td>{admin.adphone}</td>                 {/* 관리자 연락처 */}
                            <td>
                                <button onClick={() => handleDelete(admin.adid)}>
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
}