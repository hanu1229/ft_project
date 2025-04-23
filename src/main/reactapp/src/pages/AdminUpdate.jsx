// AdminUpdate.jsx | 관리자 정보 수정 화면 | rw 25-04-23 생성

import { useState } from 'react';
import axios from 'axios';

export default function AdminUpdate() {
    const [form, setForm] = useState({
        adid: '',        // 수정할 대상 관리자 ID
        adname: '',      // 새로운 이름
        adphone: ''      // 새로운 전화번호
    });

    // [1] 입력 필드 값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // [2] 수정 요청 처리
    const handleUpdate = async () => {
        try {
            const res = await axios.put('http://localhost:8080/admin/update', form);
            alert(res.data ? '수정 성공' : '수정 실패 (존재하지 않는 ID)');
        } catch (err) {
            console.error('수정 요청 오류', err);
            alert('오류 발생');
        }
    };

    return (
        <div>
            <h2>관리자 정보 수정</h2>
            <input name="adid" placeholder="수정할 ID" onChange={handleChange} />
            <input name="adname" placeholder="새 이름" onChange={handleChange} />
            <input name="adphone" placeholder="새 전화번호" onChange={handleChange} />
            <button onClick={handleUpdate}>정보 수정</button>
        </div>
    );
}