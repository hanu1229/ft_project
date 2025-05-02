// DeveloperDetail.jsx | rw 25-05-01
// [설명] 개발자 상세 조회 + 수정 + 상태변경 기능 포함

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getDeveloperDetail, updateDeveloper, updateDeveloperState
} from '../../api/developerApi';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Typography, Box, Input, Button, Divider, Select, Option
} from '@mui/joy';

export default function DeveloperDetail() {
    const { dno } = useParams();                         // [1] URL에서 개발자 번호 추출
    const [dev, setDev] = useState(null);                // [2] 상세 조회 원본 데이터
    const [form, setForm] = useState({});                // [3] 수정용 상태
    const [newState, setNewState] = useState();          // [4] 상태코드 변경용
    const token = localStorage.getItem('token');

    // [5] 개발자 상세 정보 불러오기
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDeveloperDetail(token);
                setDev(res.data);
                setForm(res.data);
                setNewState(res.data.dstate);
            } catch (err) {
                alert('상세 조회 실패');
            }
        };
        fetchDetail();
    }, [token]);

    // [6] 입력값 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // [7] 정보 수정
    const handleUpdate = async () => {
        try {
            const res = await updateDeveloper(token, form);
            if (res.data) alert('수정 완료');
        } catch (err) {
            alert('수정 실패');
        }
    };

    // [8] 상태코드 변경 요청
    const handleStateUpdate = async () => {
        try {
            const res = await updateDeveloperState(token, {
                dno: form.dno,
                dstate: newState
            });
            if (res.data) alert('상태코드 변경 완료');
        } catch (err) {
            alert('변경 실패');
        }
    };

    if (!dev) return <p>로딩 중...</p>;

    return (
        <AdminLayout>
            <Typography level="h3">개발자 상세</Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input name="dname" value={form.dname || ''} onChange={handleChange} placeholder="이름" />
                <Input name="demail" value={form.demail || ''} onChange={handleChange} placeholder="이메일" />
                <Input name="dphone" value={form.dphone || ''} onChange={handleChange} placeholder="전화번호" />

                <Typography level="body-md">상태코드 변경</Typography>
                <Select value={newState} onChange={(e, val) => setNewState(val)}>
                    <Option value={0}>대기(0)</Option>
                    <Option value={1}>승인(1)</Option>
                    <Option value={9}>삭제(9)</Option>
                </Select>

                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button onClick={handleUpdate}>정보 수정</Button>
                    <Button onClick={handleStateUpdate}>상태코드 변경</Button>
                </Box>
            </Box>
        </AdminLayout>
    );
}