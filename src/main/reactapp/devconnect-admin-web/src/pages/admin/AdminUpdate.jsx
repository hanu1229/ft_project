// AdminUpdate.jsx | rw 25-05-01
// [설명] 관리자 본인 정보 수정 화면 (이름 / 전화번호)

import React, { useEffect, useState } from 'react';
import { getAdminInfo, updateAdmin } from '../../api/adminApi';
import AdminLayout from '../../layouts/AdminLayout';
import { Box, Typography, Input, Button, Stack } from '@mui/joy';
import { useNavigate } from 'react-router-dom';

export default function AdminUpdate() {
    const [admin, setAdmin] = useState({ adname: '', adphone: '' });
    const navigate = useNavigate();

    useEffect(() => {
        getAdminInfo().then((res) => setAdmin(res.data));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAdmin((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('adname', admin.adname);
        formData.append('adphone', admin.adphone);
        const result = await updateAdmin(formData);
        if (result.data === true) {
            alert('수정 완료');
            navigate('/admin/dashboard');
        } else {
            alert('수정 실패');
        }
    };

    return (
        <AdminLayout>
            <Typography level="h3" sx={{ mb: 2 }}>
                🛠 관리자 정보 수정
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
                <Stack spacing={2}>
                    <Input name="adname" value={admin.adname} onChange={handleChange} placeholder="이름" required />
                    <Input name="adphone" value={admin.adphone} onChange={handleChange} placeholder="전화번호" required />
                    <Button type="submit" color="primary">
                        수정하기
                    </Button>
                </Stack>
            </Box>
        </AdminLayout>
    );
}
