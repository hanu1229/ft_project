// AdminForm.jsx | rw 25-04-30
// [설명] 관리자 등록/수정 시 사용하는 입력 폼 컴포넌트입니다.
//        adid, adpwd, adname, adphone 값을 부모로부터 전달받아 입력 필드와 양방향 바인딩합니다.

import React from "react";

// [props 구조]
// - adid: 관리자 아이디
// - setAdid: adid 상태 변경 함수
// - adpwd: 비밀번호
// - setAdpwd: 비밀번호 상태 변경 함수
// - adname: 관리자 이름
// - setAdname: 이름 상태 변경 함수
// - adphone: 전화번호
// - setAdphone: 전화번호 상태 변경 함수

export default function AdminForm({
                                      adid, setAdid,
                                      adpwd, setAdpwd,
                                      adname, setAdname,
                                      adphone, setAdphone
                                  }) {
    return (
        <div style={{ width: "300px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "10px" }}>
            <label>
                아이디
                <input
                    type="text"
                    value={adid}
                    onChange={(e) => setAdid(e.target.value)}
                />
            </label>

            <label>
                비밀번호
                <input
                    type="password"
                    value={adpwd}
                    onChange={(e) => setAdpwd(e.target.value)}
                />
            </label>

            <label>
                이름
                <input
                    type="text"
                    value={adname}
                    onChange={(e) => setAdname(e.target.value)}
                />
            </label>

            <label>
                전화번호
                <input
                    type="text"
                    value={adphone}
                    onChange={(e) => setAdphone(e.target.value)}
                />
            </label>
        </div>
    );
}