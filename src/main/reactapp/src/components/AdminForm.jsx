import React from "react";

export default function AdminForm({ adid, setAdid, adpwd, setAdpwd, adname, setAdname, adphone, setAdphone }) {
    return (
        <div>
            <input type="text" placeholder="아이디" value={adid} onChange={(e) => setAdid(e.target.value)} />
            <input type="password" placeholder="비밀번호" value={adpwd} onChange={(e) => setAdpwd(e.target.value)} />
            <input type="text" placeholder="이름" value={adname} onChange={(e) => setAdname(e.target.value)} />
            <input type="text" placeholder="전화번호" value={adphone} onChange={(e) => setAdphone(e.target.value)} />
        </div>
    );
}