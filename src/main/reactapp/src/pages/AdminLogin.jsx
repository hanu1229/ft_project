import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
    const [loginData, setLoginData] = useState({ adid: '', adpwd: '' });
    const navigate = useNavigate(); // 훅 사용

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleLogin = async () => {
        const res = await axios.post('http://localhost:8080/admin/login', loginData);
        if (res.data) {
            alert(`로그인 성공: ${res.data}`);
            // 로그인 성공 시 이동할 페이지로 라우팅
            navigate('/admin/info'); // 또는 원하는 경로
        } else {
            alert('로그인 실패');
        }
    };

    return (
        <div>
            <h2>관리자 로그인</h2>
            <input name="adid" placeholder="아이디" onChange={handleChange} />
            <input name="adpwd" type="password" placeholder="비밀번호" onChange={handleChange} />
            <button onClick={handleLogin}>로그인</button>
        </div>
    );
}