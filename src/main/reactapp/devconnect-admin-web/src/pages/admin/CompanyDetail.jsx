// CompanyDetail.jsx | rw 25-05-02 리팩토링 최종본
// [설명] 관리자 전용 기업 상세 조회 / 정보 수정 / 상태코드 변경 화면
//        - Joy UI 기반 / 넷플릭스 스타일 블랙 & 핑크 테마
//        - 기업 정보 로딩, 수정, 상태코드 변경까지 전체 기능 포함

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getCompanyDetail,
    updateCompany,
    updateCompanyState
} from '../../api/companyApi';
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

export default function CompanyDetail() {
    const { cno } = useParams();                      // ✅ URL 경로에서 기업 번호 추출
    const token = localStorage.getItem('token');     // ✅ 로그인 관리자 토큰

    // ✅ 상태값 선언
    const [company, setCompany] = useState(null);    // 조회된 원본 기업 정보
    const [form, setForm] = useState({               // 입력 폼 상태값 초기화
        cname: '', ceo: '', cemail: '', cphone: '', cstate: 0
    });
    const [newState, setNewState] = useState(0);     // 상태코드 변경용 값

    // ✅ 기업 상세 정보 불러오기
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getCompanyDetail(token, cno);
                setCompany(res.data);
                setForm(res.data);
                setNewState(res.data.cstate);
            } catch (err) {
                console.error(err);
                alert('기업 상세 조회 실패');
            }
        };
        fetchDetail();
    }, [token, cno]);

    // ✅ 입력 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ 정보 수정 요청
    const handleUpdate = async () => {
        try {
            const res = await updateCompany(token, form);
            if (res.data) alert('정보 수정 완료');
        } catch (err) {
            alert('수정 실패');
        }
    };

    // ✅ 상태코드 변경 요청
    const handleStateUpdate = async () => {
        try {
            const res = await updateCompanyState(token, {
                cno: form.cno,
                cstate: newState
            });
            if (res.data) alert('상태코드 변경 완료');
        } catch (err) {
            alert('상태 변경 실패');
        }
    };

    // ✅ 로딩 중 처리
    if (!company) return <p style={{ color: '#fff' }}>로딩 중...</p>;

    return (
        <div>
            <Typography level="h3" sx={{ mb: 2, color: '#ff4081', fontWeight: 'bold' }}>
                🏢 기업 상세
            </Typography>

            <Divider sx={{ mb: 3, borderColor: '#ff4081' }} />

            <Box
                sx={{
                    display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 480,
                    bgcolor: '#1e1e1e', p: 3, borderRadius: 'lg',
                    border: '1px solid #ff4081',
                    boxShadow: '0 0 20px rgba(255,64,129,0.2)',
                    color: '#fff'
                }}
            >
                {/* ✅ 기업 정보 입력 */}
                <Input name="cname" value={form.cname} onChange={handleChange} placeholder="기업명" sx={{ bgcolor: '#000', color: '#fff' }} />
                <Input name="ceo" value={form.ceo} onChange={handleChange} placeholder="대표자명" sx={{ bgcolor: '#000', color: '#fff' }} />
                <Input name="cemail" value={form.cemail} onChange={handleChange} placeholder="이메일" sx={{ bgcolor: '#000', color: '#fff' }} />
                <Input name="cphone" value={form.cphone} onChange={handleChange} placeholder="전화번호" sx={{ bgcolor: '#000', color: '#fff' }} />

                {/* ✅ 상태 코드 선택 */}
                <Typography level="body-md" sx={{ mt: 2, color: '#ff4081' }}>상태코드 변경</Typography>
                <Select value={newState} onChange={(e, val) => setNewState(val)} sx={{ bgcolor: '#000', color: '#fff' }}>
                    <Option value={0}>대기 (0)</Option>
                    <Option value={1}>승인 (1)</Option>
                    <Option value={9}>삭제 (9)</Option>
                </Select>

                {/* ✅ 버튼 그룹 */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button onClick={handleUpdate} variant="outlined" sx={{ flex: 1, borderColor: '#ff4081', color: '#ff4081', '&:hover': { bgcolor: '#ff4081', color: '#000' } }}>정보 수정</Button>
                    <Button onClick={handleStateUpdate} variant="outlined" sx={{ flex: 1, borderColor: '#ff4081', color: '#ff4081', '&:hover': { bgcolor: '#ff4081', color: '#000' } }}>상태 변경</Button>
                </Box>
            </Box>
        </div>
    );
}
