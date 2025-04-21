import { useState } from 'react';
import axios from 'axios';

export default function AdminSignup() {
    const [form, setForm] = useState({
        adid: '',
        adpwd: '',
        adname: '',
        adphone: ''
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const res = await axios.post('http://localhost:8080/admin/signup', form);
        alert(res.data ? '회원가입 성공' : '이미 존재하는 ID입니다.');
    };

    return (
        <div>
            <h2>관리자 회원가입</h2>
            <input name="adid" placeholder="아이디" onChange={handleChange} />
            <input name="adpwd" type="password" placeholder="비밀번호" onChange={handleChange} />
            <input name="adname" placeholder="이름" onChange={handleChange} />
            <input name="adphone" placeholder="전화번호" onChange={handleChange} />
            <button onClick={handleSubmit}>회원가입</button>
        </div>
    );
}