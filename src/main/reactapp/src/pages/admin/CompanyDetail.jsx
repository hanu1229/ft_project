// =======================================================================================
// CompanyDetail.jsx | rw 25-05-10 최종 리팩토링
// [설명] 관리자 전용 기업 상세조회 + 정보 수정
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCompanyDetail, updateCompany } from '../../api/companyApi.js';
import { Typography, Box, Input, Button, Divider } from '@mui/joy';

export default function CompanyDetail() {
    const { cno } = useParams();
    const token = localStorage.getItem('token');
    const [form, setForm] = useState(null);

    // ✅ 기업 상세 정보 조회
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getCompanyDetail(token, cno);
                setForm(res.data);
            } catch (err) {
                alert('기업 상세 조회 실패');
            }
        };
        fetch();
    }, [cno, token]);

    // ✅ 입력 변경 핸들러
    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ 정보 수정 요청
    const handleUpdate = async () => {
        try {
            const res = await updateCompany(token, form);
            if (res.data) alert('수정 완료');
        } catch (err) {
            alert('수정 실패');
        }
    };

    if (!form) return <p>로딩 중...</p>;

    return (
        <Box sx={{ px: 3, py: 3, maxWidth: 500 }}>
            <Typography level="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#12b886' }}>
                기업 상세
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Input name="cname" value={form.cname} onChange={handleChange} placeholder="기업명" />
            <Input name="ceo" value={form.ceo} onChange={handleChange} placeholder="대표자" sx={{ mt: 1 }} />
            <Input name="cemail" value={form.cemail} onChange={handleChange} placeholder="이메일" sx={{ mt: 1 }} />
            <Input name="cphone" value={form.cphone} onChange={handleChange} placeholder="전화번호" sx={{ mt: 1 }} />

            <Button onClick={handleUpdate} sx={{ mt: 2, bgcolor: '#12b886', color: '#fff' }}>
                정보 수정
            </Button>
        </Box>
    );
}