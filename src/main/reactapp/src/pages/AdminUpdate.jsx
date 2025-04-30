// AdminUpdate.jsx | rw 25-04-30
// [설명] 로그인된 관리자의 이름 및 전화번호를 수정할 수 있는 화면입니다.
//        JWT 토큰 기반으로 본인 정보를 불러오고, 수정 후 서버에 반영합니다.

import React, { useState, useEffect } from "react";                   // [1] React 훅 import
import { getAdminInfo, updateAdmin } from "../api/adminApi";         // [2] 관리자 정보 조회 / 수정 API
import { getToken } from "../utils/tokenUtil";                       // [3] JWT 토큰 불러오기
import { useNavigate } from "react-router-dom";                      // [4] 페이지 이동용 훅

export default function AdminUpdate() {
    const [adname, setAdname] = useState("");                        // [A] 이름 상태값
    const [adphone, setAdphone] = useState("");                      // [B] 전화번호 상태값
    const navigate = useNavigate();                                  // [C] 페이지 이동 함수
    const token = getToken();                                        // [D] 로컬에 저장된 JWT 토큰

    // =======================================================================================
    // [1] 기존 관리자 정보 불러오기 (마운트 시 1회 실행)
    useEffect(() => {
        const fetchAdminInfo = async () => {
            try {
                const res = await getAdminInfo(token);               // (1) 토큰으로 관리자 본인 정보 요청
                setAdname(res.data.adname);                          // (2) 이름 상태값 설정
                setAdphone(res.data.adphone);                        // (3) 전화번호 상태값 설정
            } catch (err) {
                alert("정보 조회 실패");                             // (4) 오류 발생 시 로그인 페이지 이동
                navigate("/admin/login");
            }
        };
        fetchAdminInfo();                                            // (5) 즉시 실행
    }, [token, navigate]);                                           // v 토큰이나 navigate 변경 시 재실행

    // =======================================================================================
    // [2] 수정 요청 실행 함수
    const handleUpdate = async () => {
        try {
            const formData = new FormData();                         // (1) form-data 형식 생성
            formData.append("adname", adname);                       // (2) 이름 값 추가
            formData.append("adphone", adphone);                     // (3) 전화번호 값 추가

            const res = await updateAdmin(token, formData);          // (4) 수정 API 요청
            if (res.data === true) {
                alert("정보 수정 완료");                             // (5) 성공 시 알림
                navigate("/admin/dashboard");                        // (6) 대시보드로 이동
            } else {
                alert("정보 수정 실패");                             // (7) 실패 시 메시지 출력
            }
        } catch (err) {
            alert("정보 수정 에러");                                  // (8) 예외 발생 시 처리
        }
    };

    // =======================================================================================
    // [3] 화면 렌더링 (입력창 + 버튼)
    return (
        <div>
            <h2>관리자 정보 수정</h2>

            {/* [1] 이름 입력 필드 */}
            <input
                value={adname}
                onChange={(e) => setAdname(e.target.value)}
                placeholder="이름 수정"
            />

            {/* [2] 전화번호 입력 필드 */}
            <input
                value={adphone}
                onChange={(e) => setAdphone(e.target.value)}
                placeholder="전화번호 수정"
            />

            {/* [3] 수정 버튼 */}
            <button onClick={handleUpdate}>수정하기</button>
        </div>
    );
}