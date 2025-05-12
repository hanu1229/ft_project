// =======================================================================================
// DeveloperDetail.jsx | rw 25-05-11 관리자 전용 리팩토링 (FormData 필수값 전부 포함)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDeveloperDetail, updateDeveloper } from '../../api/developerApi.js';
import {
    Typography, Box, Input, Button, Divider
} from '@mui/joy';

export default function DeveloperDetail() {
    const { dno } = useParams();
    const token = localStorage.getItem('token');
    const [form, setForm] = useState(null);

    // ✅ 개발자 상세 조회
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

    // ✅ 입력값 변경 처리
    const handleChange = e => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // ✅ 프로필 파일 업로드
    const handleFileChange = e => {
        setForm(prev => ({ ...prev, dfile: e.target.files[0] }));
    };

    // ✅ 수정 처리 (FormData 전송)
    const handleUpdate = async () => {
        try {
            const formData = new FormData();

            // 필수 필드
            formData.append('dno', form.dno);
            formData.append('dname', form.dname || '');
            formData.append('demail', form.demail || '');
            formData.append('dphone', form.dphone || '');
            formData.append('daddress', form.daddress || '');
            formData.append('dlevel', form.dlevel || 1);
            formData.append('dcurrentExp', form.dcurrentExp || 0);
            formData.append('dtotalExp', form.dtotalExp || 0);

            // 선택 필드
            if (form.dpwd) formData.append('dpwd', form.dpwd);
            if (form.dfile) formData.append('dfile', form.dfile);

            const res = await updateDeveloper(token, formData);
            if (res.data) alert('수정 완료');
        } catch {
            alert('수정 실패');
        }
    };

    if (!form) return <Typography>로딩 중...</Typography>;

    return (
        <Box sx={{ px: 3, py: 3, maxWidth: 500 }}>
            <Typography level="h3" sx={{ mb: 2, fontWeight: 'bold', color: '#12b886' }}>
                👨‍💻 개발자 상세
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Input name="dname" value={form.dname || ''} onChange={handleChange} placeholder="이름" />
            <Input name="demail" value={form.demail || ''} onChange={handleChange} placeholder="이메일" sx={{ mt: 1 }} />
            <Input name="dphone" value={form.dphone || ''} onChange={handleChange} placeholder="전화번호" sx={{ mt: 1 }} />
            <Input name="daddress" value={form.daddress || ''} onChange={handleChange} placeholder="주소" sx={{ mt: 1 }} />
            <Input name="dlevel" value={form.dlevel || ''} onChange={handleChange} placeholder="레벨" type="number" sx={{ mt: 1 }} />
            <Input name="dcurrentExp" value={form.dcurrentExp || ''} onChange={handleChange} placeholder="현재 경험치" type="number" sx={{ mt: 1 }} />
            <Input name="dtotalExp" value={form.dtotalExp || ''} onChange={handleChange} placeholder="총 경험치" type="number" sx={{ mt: 1 }} />
            <Input name="dpwd" onChange={handleChange} placeholder="비밀번호 (선택)" sx={{ mt: 1 }} />
            <Input type="file" accept="image/*" onChange={handleFileChange} sx={{ mt: 1 }} />

            <Button onClick={handleUpdate} sx={{ mt: 2, bgcolor: '#12b886', color: '#fff' }}>
                정보 수정
            </Button>
        </Box>
    );
}