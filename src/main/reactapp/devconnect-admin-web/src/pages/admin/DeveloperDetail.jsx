// DeveloperDetail.jsx | rw 25-05-02 - 최종 매우 최적화된 바위의 버전
// [설명] 관리자전용 개발자 상세 페이지 (Joy UI 공\uud56d)

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getDeveloperDetail,
    updateDeveloper,
    updateDeveloperState
} from '../../api/developerApi';

import AdminLayout from '../../layouts/AdminLayout';
import {
    Typography,
    Box,
    Input,
    Button,
    Divider,
    Select,
    Option
} from '@mui/joy';

export default function DeveloperDetail() {
    const { dno } = useParams();
    const [dev, setDev] = useState(null);
    const [form, setForm] = useState({});
    const [newState, setNewState] = useState();
    const token = localStorage.getItem('token');

    // 상세 조회
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDeveloperDetail(token, dno);
                setDev(res.data);
                setForm(res.data);
                setNewState(res.data.dstate);
            } catch (err) {
                console.error('상세조회오류', err);
                alert('개발자 상세정보 불러오기 실패');
            }
        };
        fetchDetail();
    }, [token, dno]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const res = await updateDeveloper(token, form);
            if (res.data) alert('정보수정 완료');
        } catch (err) {
            alert('수정 실패');
        }
    };

    const handleStateUpdate = async () => {
        try {
            const res = await updateDeveloperState(token, {
                dno: form.dno,
                dstate: newState
            });
            if (res.data) alert('상태코드 변경 완료');
        } catch (err) {
            alert('상태 변경 실패');
        }
    };

    if (!dev) return <p style={{ color: '#fff' }}>로딩 중...</p>;

    return (
        <div>
            <Typography level="h3" sx={{ mb: 2, color: '#ff4081', fontWeight: 'bold' }}>
                👨‍💻 개발자 상세 정보
            </Typography>

            <Divider sx={{ mb: 3, borderColor: '#ff4081' }} />

            <Box sx={{
                display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 480,
                bgcolor: '#1e1e1e', p: 3, borderRadius: 'lg', border: '1px solid #ff4081',
                boxShadow: '0 0 20px rgba(255,64,129,0.2)', color: '#fff'
            }}>
                <Input name="dname" value={form.dname || ''} onChange={handleChange} placeholder="이름"
                       sx={{ bgcolor: '#000', color: '#fff' }} />
                <Input name="demail" value={form.demail || ''} onChange={handleChange} placeholder="이메일"
                       sx={{ bgcolor: '#000', color: '#fff' }} />
                <Input name="dphone" value={form.dphone || ''} onChange={handleChange} placeholder="전화번호"
                       sx={{ bgcolor: '#000', color: '#fff' }} />

                <Box>
                    <Typography level="body-md" sx={{ mb: 1, color: '#ff4081' }}>
                        상태코드 변경
                    </Typography>
                    <Select value={newState} onChange={(e, val) => setNewState(val)} sx={{ bgcolor: '#000', color: '#fff' }}>
                        <Option value={0}>대기 (0)</Option>
                        <Option value={1}>승인 (1)</Option>
                        <Option value={9}>삭제 (9)</Option>
                    </Select>
                </Box>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button onClick={handleUpdate} variant="outlined" sx={{
                        borderColor: '#ff4081', color: '#ff4081',
                        '&:hover': { bgcolor: '#ff4081', color: '#000' }
                    }}>
                        정보 수정
                    </Button>
                    <Button onClick={handleStateUpdate} variant="outlined" sx={{
                        borderColor: '#00e676', color: '#00e676',
                        '&:hover': { bgcolor: '#00e676', color: '#000' }
                    }}>
                        상태 변경
                    </Button>
                </Box>
            </Box>
        </div>
    );
}
