import { useState } from 'react';
import axios from 'axios';

export default function AdminInfo() {
    const [adid, setAdid] = useState('');
    const [info, setInfo] = useState(null);

    const handleFetch = async () => {
        const res = await axios.get(`http://localhost:8080/admin/info?adid=${adid}`);
        setInfo(res.data);
    };

    return (
        <div>
            <h2>관리자 정보 조회</h2>
            <input placeholder="관리자 ID" onChange={(e) => setAdid(e.target.value)} />
            <button onClick={handleFetch}>조회</button>

            {info && (
                <div>
                    <p>이름: {info.adname}</p>
                    <p>전화: {info.adphone}</p>
                    <p>생성일: {info.createAt}</p>
                </div>
            )}
        </div>
    );
}