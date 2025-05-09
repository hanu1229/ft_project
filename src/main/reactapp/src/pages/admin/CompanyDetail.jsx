// =======================================================================================
// CompanyDetail.jsx | rw 25-05-08 관리자 전용 리팩토링
// [설명]
// - 관리자만 접근 가능한 기업 상세 조회 및 수정/상태변경 화면
// - API 연동: getCompanyDetail, updateCompanyState, changeCompanyState
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getCompanyDetail,
    updateCompanyState,
    changeCompanyState,
} from '../../api/companyApi.js';
import {
    Typography,
    Box,
    Input,
    Button,
    Divider,
    Select,
    Option,
} from '@mui/joy';

export default function CompanyDetail() {
    const { cno } = useParams(); // ✅ 기업 고유번호 URL 추출
    const token = localStorage.getItem('token');

    const [company, setCompany] = useState(null); // ✅ 원본 데이터
    const [form, setForm] = useState({}); // ✅ 수정용 상태값
    const [newState, setNewState] = useState(0); // ✅ 상태 변경값

    // =======================================================================================
    // ✅ 1. 기업 상세 조회
    // =======================================================================================
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getCompanyDetail(token, cno);
                setCompany(res.data);
                setForm(res.data);
                setNewState(res.data.cstate);
            } catch (err) {
                console.error('❌ 기업 상세 조회 실패:', err);
                alert('기업 정보를 불러오지 못했습니다.');
            }
        };
        fetchDetail();
    }, [token, cno]);

    // =======================================================================================
    // ✅ 2. 입력 필드 핸들러
    // =======================================================================================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // =======================================================================================
    // ✅ 3. 정보 수정 요청 (FormData 전송)
    // =======================================================================================
    const handleUpdate = async () => {
        try {
            const formData = new FormData();
            for (const key in form) formData.append(key, form[key]);
            const res = await updateCompanyState(token, formData);
            if (res.data) alert('✅ 기업 정보 수정 완료');
        } catch (err) {
            console.error('❌ 수정 실패:', err);
            alert('정보 수정 실패');
        }
    };

    // =======================================================================================
    // ✅ 4. 상태코드 변경 요청
    // =======================================================================================
    const handleStateUpdate = async () => {
        try {
            const dto = { cno: form.cno, cstate: newState };
            const res = await changeCompanyState(token, dto);
            if (res.data) alert('✅ 상태코드 변경 완료');
        } catch (err) {
            console.error('❌ 상태 변경 실패:', err);
            alert('상태 변경 실패');
        }
    };

    if (!company) return <Typography level="body-md">로딩 중...</Typography>;

    // =======================================================================================
    // ✅ 렌더링
    // =======================================================================================
    return (
        <Box sx={{ bgcolor: '#fff', px: 3, py: 3, borderRadius: 'md' }}>
            <Typography level="h3" sx={{ mb: 2, color: '#12b886', fontWeight: 'bold' }}>
                🏢 기업 상세 정보
            </Typography>

            <Divider sx={{ mb: 3, borderColor: '#ced4da' }} />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 500,
                    p: 3,
                    borderRadius: 'md',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    boxShadow: 'sm',
                }}
            >
                <Input name="cname" value={form.cname || ''} onChange={handleChange} placeholder="기업명" variant="soft" />
                <Input name="ceo" value={form.ceo || ''} onChange={handleChange} placeholder="대표자명" variant="soft" />
                <Input name="cemail" value={form.cemail || ''} onChange={handleChange} placeholder="이메일" variant="soft" />
                <Input name="cphone" value={form.cphone || ''} onChange={handleChange} placeholder="전화번호" variant="soft" />

                <Typography level="body-md" sx={{ mt: 2, color: '#495057' }}>
                    상태코드 변경
                </Typography>
                <Select value={newState} onChange={(e, val) => setNewState(val)} variant="soft">
                    <Option value={0}>대기 (0)</Option>
                    <Option value={1}>승인 (1)</Option>
                    <Option value={9}>삭제 (9)</Option>
                </Select>

                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                        onClick={handleUpdate}
                        fullWidth
                        variant="outlined"
                        sx={{
                            color: '#12b886',
                            borderColor: '#12b886',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#12b886', color: '#fff' },
                        }}
                    >
                        정보 수정
                    </Button>
                    <Button
                        onClick={handleStateUpdate}
                        fullWidth
                        variant="outlined"
                        sx={{
                            color: '#12b886',
                            borderColor: '#12b886',
                            fontWeight: 'bold',
                            '&:hover': { bgcolor: '#12b886', color: '#fff' },
                        }}
                    >
                        상태 변경
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}
