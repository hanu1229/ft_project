// =======================================================================================
// CompanyDetail.jsx | rw 25-05-02 최종 리팩토링 (ChatGPT 스타일 적용)
// [설명]
// - 관리자 전용 기업 상세조회, 수정, 상태코드 변경 화면
// - Joy UI + 흰 배경 + 민트 포인트 테마
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getCompanyDetail,
    updateCompany,
    updateCompanyState
} from '../../api/companyApi.js';
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
    const { cno } = useParams();
    const token = localStorage.getItem('token');

    const [company, setCompany] = useState(null);
    const [form, setForm] = useState({
        cname: '',
        ceo: '',
        cemail: '',
        cphone: '',
        cstate: 0
    });
    const [newState, setNewState] = useState(0);

    // ✅ 기업 상세 정보 로딩
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

    // ✅ 입력 필드 변경
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ 기업 정보 수정
    const handleUpdate = async () => {
        try {
            const res = await updateCompany(token, form);
            if (res.data) alert('✅ 정보 수정 완료');
        } catch (err) {
            alert('❌ 정보 수정 실패');
        }
    };

    // ✅ 상태코드 변경
    const handleStateUpdate = async () => {
        try {
            const res = await updateCompanyState(token, {
                cno: form.cno,
                cstate: newState
            });
            if (res.data) alert('✅ 상태코드 변경 완료');
        } catch (err) {
            alert('❌ 상태 변경 실패');
        }
    };

    // ✅ 로딩 중 표시
    if (!company) return <p style={{ color: '#666' }}>로딩 중...</p>;

    // =======================================================================================
    // ✅ 렌더링
    // =======================================================================================
    return (
        <Box sx={{ bgcolor: '#fff', px: 3, py: 3, borderRadius: 'md' }}>
            <Typography level="h3" sx={{ mb: 2, color: '#12b886', fontWeight: 'bold' }}>
                🏢 기업 상세
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
                {/* 기업 정보 입력 */}
                <Input name="cname" value={form.cname} onChange={handleChange} placeholder="기업명" variant="soft" />
                <Input name="ceo" value={form.ceo} onChange={handleChange} placeholder="대표자명" variant="soft" />
                <Input name="cemail" value={form.cemail} onChange={handleChange} placeholder="이메일" variant="soft" />
                <Input name="cphone" value={form.cphone} onChange={handleChange} placeholder="전화번호" variant="soft" />

                {/* 상태코드 선택 */}
                <Typography level="body-md" sx={{ mt: 2, color: '#495057' }}>
                    상태코드 변경
                </Typography>
                <Select value={newState} onChange={(e, val) => setNewState(val)} variant="soft">
                    <Option value={0}>대기 (0)</Option>
                    <Option value={1}>승인 (1)</Option>
                    <Option value={9}>삭제 (9)</Option>
                </Select>

                {/* 버튼 영역 */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                        onClick={handleUpdate}
                        fullWidth
                        variant="outlined"
                        sx={{
                            color: '#12b886',
                            borderColor: '#12b886',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: '#12b886',
                                color: '#fff'
                            }
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
                            '&:hover': {
                                bgcolor: '#12b886',
                                color: '#fff'
                            }
                        }}
                    >
                        상태 변경
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}