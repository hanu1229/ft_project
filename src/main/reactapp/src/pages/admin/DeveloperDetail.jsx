// =======================================================================================
// DeveloperDetail.jsx | rw 25-05-10 최종 리팩토링
// [설명] 관리자 전용 개발자 상세 정보 조회 + 수정
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDeveloperDetail, updateDeveloper } from '../../api/developerApi.js';
import { Typography, Box, Input, Button, Divider } from '@mui/joy';

export default function DeveloperDetail() {
    const { dno } = useParams();
    const token = localStorage.getItem('token');
    const [form, setForm] = useState(null);

    // ✅ 개발자 상세 정보 조회
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getDeveloperDetail(token, dno);
                setForm(res.data);
            } catch {
                alert('개발자 상세 조회 실패');
            }
        };
        fetch();
    }, [dno, token]);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const res = await updateDeveloper(token, form);
            if (res.data) alert('수정 완료');
        } catch {
            alert('수정 실패');
        }
    };

    if (!form) return <p>로딩 중...</p>;

    return (
        <Box sx={{ px: 3, py: 3, maxWidth: 500 }}>
            <Typography level="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#12b886' }}>
                개발자 상세
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Input name="dname" value={form.dname} onChange={handleChange} placeholder="이름" />
            <Input name="demail" value={form.demail} onChange={handleChange} placeholder="이메일" sx={{ mt: 1 }} />
            <Input name="dphone" value={form.dphone} onChange={handleChange} placeholder="전화번호" sx={{ mt: 1 }} />

            <Button onClick={handleUpdate} sx={{ mt: 2, bgcolor: '#12b886', color: '#fff' }}>
                정보 수정
            </Button>
        </Box>
    );
}