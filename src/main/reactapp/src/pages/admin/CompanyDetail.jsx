// =======================================================================================
// CompanyDetail.jsx | rw 25-05-03 최종 리팩토링 (v3)
// [설명]
// - 백엔드 완성형 API 기반에 맞춘 최종 구조
// - ✅ 상태 변경: /api/company/state (PUT, JSON)
// - ✅ 정보 수정: /api/company/update (PUT, @ModelAttribute)
// - ✅ 상태 9: 삭제 상태 → 버튼 비활성
// - ✅ cprofile 이미지 미리보기 지원
// =======================================================================================

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    updateCompany,
    updateCompanyState
} from '../../api/companyApi.js';
import {
    Box,
    Typography,
    Input,
    Select,
    Option,
    Button,
    Alert,
    Divider,
    Avatar
} from '@mui/joy';

export default function CompanyDetail() {
    const { cno } = useParams();
    const token = localStorage.getItem('token');

    const [form, setForm] = useState({
        cno: cno,
        cname: '',
        ceo: '',
        cemail: '',
        cphone: '',
        cadress: '',
        cbusiness: '',
        cprofile: '',
        cpwd: '',
        state: 0
    });

    const [newState, setNewState] = useState(0);

    // [!] 백엔드 조회 API 없음 → 수동 입력 경고 + 상태 초기값 동기화
    useEffect(() => {
        alert('⚠️ 상세조회 API가 없습니다. 데이터를 수동으로 입력하세요.');
        setNewState(form.state);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        if (!form.cname || !form.ceo || !form.cemail || !form.cphone) {
            alert('❗ 기업명, 대표자명, 이메일, 전화번호는 필수입니다.');
            return;
        }
        try {
            const formData = new FormData();
            for (let key in form) formData.append(key, form[key]);
            const res = await updateCompany(token, formData);
            if (res.data === true) alert('✅ 정보 수정 완료');
            else alert('❌ 정보 수정 실패');
        } catch (err) {
            alert('❌ 서버 오류');
        }
    };

    const handleStateChange = async () => {
        try {
            const res = await updateCompanyState(token, {
                cno: form.cno,
                state: newState
            });
            if (res.data === true) {
                alert('✅ 상태 변경 완료');
                setForm((prev) => ({ ...prev, state: newState }));
            } else {
                alert('❌ 상태 변경 실패');
            }
        } catch (err) {
            alert('❌ 서버 오류');
        }
    };

    const profileUrl = form.cprofile ? `/uploads/${form.cprofile}` : null;

    return (
        <Box sx={{ p: 3, bgcolor: '#fff', borderRadius: 'md' }}>
            <Typography level="h3" sx={{ mb: 2, color: '#12b886', fontWeight: 'bold' }}>
                🏢 기업 상세 정보
            </Typography>

            {form.state === 9 && (
                <Alert color="danger" variant="soft" sx={{ mb: 2 }}>
                    🚫 현재 삭제 상태입니다. 수정이 제한됩니다.
                </Alert>
            )}

            <Divider sx={{ mb: 3 }} />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 500,
                    p: 3,
                    borderRadius: 'md',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #dee2e6'
                }}
            >
                <Input name="cname" value={form.cname} onChange={handleChange} placeholder="기업명" variant="soft" required />
                <Input name="ceo" value={form.ceo} onChange={handleChange} placeholder="대표자명" variant="soft" required />
                <Input name="cemail" value={form.cemail} onChange={handleChange} placeholder="이메일" variant="soft" required />
                <Input name="cphone" value={form.cphone} onChange={handleChange} placeholder="전화번호" variant="soft" required />
                <Input name="cadress" value={form.cadress} onChange={handleChange} placeholder="주소" variant="soft" />
                <Input name="cbusiness" value={form.cbusiness} onChange={handleChange} placeholder="사업자번호" variant="soft" />
                <Input name="cpwd" value={form.cpwd} onChange={handleChange} placeholder="비밀번호 확인용" variant="soft" type="password" />

                {/* ✅ 이미지 미리보기 */}
                {profileUrl && (
                    <Box>
                        <Typography level="body-sm">등록된 프로필 이미지</Typography>
                        <Avatar src={profileUrl} size="lg" sx={{ mt: 1 }} />
                    </Box>
                )}

                {/* ✅ 상태 변경 */}
                <Typography level="body-md" sx={{ mt: 2, color: '#495057' }}>상태코드 변경</Typography>
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
                        disabled={form.state === 9}
                        sx={{
                            color: form.state === 9 ? '#adb5bd' : '#12b886',
                            borderColor: form.state === 9 ? '#ced4da' : '#12b886',
                            fontWeight: 'bold'
                        }}
                    >
                        정보 수정
                    </Button>
                    <Button
                        onClick={handleStateChange}
                        fullWidth
                        variant="outlined"
                        sx={{
                            color: '#12b886',
                            borderColor: '#12b886',
                            fontWeight: 'bold'
                        }}
                    >
                        상태 변경
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}