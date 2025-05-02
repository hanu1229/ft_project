// CompanyDetail.jsx | rw 25-05-01
// [설명] 기업 상세 조회 + 수정 + 상태코드 변경 기능 포함

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getCompanyDetail,
    updateCompany,
    updateCompanyState
} from '../../api/companyApi';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Typography, Box, Input, Button, Divider, Select, Option
} from '@mui/joy';

export default function CompanyDetail() {
    const { cno } = useParams();                          // [1] URL로부터 기업번호 추출
    const [company, setCompany] = useState(null);         // [2] 기업 원본 데이터
    const [form, setForm] = useState({});                 // [3] 수정용 폼 데이터
    const [newState, setNewState] = useState();           // [4] 상태코드 변경값
    const token = localStorage.getItem('token');

    // [5] 기업 상세 정보 조회
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getCompanyDetail(token);  // 관리자 계정의 기업 정보 조회
                setCompany(res.data);
                setForm(res.data);
                setNewState(res.data.cstate);
            } catch (err) {
                alert('상세 조회 실패');
            }
        };
        fetchDetail();
    }, [token]);

    // [6] 입력 필드 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // [7] 정보 수정 요청
    const handleUpdate = async () => {
        try {
            const res = await updateCompany(token, form);
            if (res.data) alert('수정 완료');
        } catch (err) {
            alert('수정 실패');
        }
    };

    // [8] 상태코드 변경 요청
    const handleStateUpdate = async () => {
        try {
            const res = await updateCompanyState(token, {
                cno: form.cno,
                cstate: newState
            });
            if (res.data) alert('상태코드 변경 완료');
        } catch (err) {
            alert('변경 실패');
        }
    };

    if (!company) return <p>로딩 중...</p>;

    return (
        <AdminLayout>
            <Typography level="h3">기업 상세</Typography>
            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input name="cname" value={form.cname || ''} onChange={handleChange} placeholder="기업명" />
                <Input name="ceo" value={form.ceo || ''} onChange={handleChange} placeholder="대표자명" />
                <Input name="cemail" value={form.cemail || ''} onChange={handleChange} placeholder="이메일" />
                <Input name="cphone" value={form.cphone || ''} onChange={handleChange} placeholder="전화번호" />

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