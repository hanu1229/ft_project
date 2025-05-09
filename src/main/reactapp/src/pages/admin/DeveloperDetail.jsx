// =======================================================================================
// DeveloperDetail.jsx | rw 25-05-08 최종 리팩토링
// [설명]
// - 관리자(Admin) 전용 개발자 상세 페이지
// - 개발자 정보 조회 + 수정 + 상태코드 변경 가능
// - Joy UI + ChatGPT 스타일 적용 (절제된 흰 배경 UI)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getDeveloperDetail,
    updateDeveloper,
    updateDeveloperState
} from '../../api/developerApi.js';

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
    // =======================================================================================
    // ✅ 상태 선언
    // =======================================================================================
    const { dno } = useParams();                                // 개발자 번호 추출 (URL 파라미터)
    const token = localStorage.getItem('token');                // 인증 토큰

    const [dev, setDev] = useState(null);                       // 원본 상세 정보
    const [form, setForm] = useState({});                       // 입력 폼 상태
    const [newState, setNewState] = useState();                 // 상태코드 변경값

    // =======================================================================================
    // ✅ 상세 조회 요청
    // =======================================================================================
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getDeveloperDetail(token, dno);
                setDev(res.data);
                setForm(res.data);
                setNewState(res.data.dstate);
            } catch (err) {
                console.error('❌ 개발자 상세 조회 실패', err);
                alert('개발자 상세정보 조회 실패');
            }
        };
        fetchDetail();
    }, [token, dno]);

    // =======================================================================================
    // ✅ 입력 필드 변경 핸들러
    // =======================================================================================
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // =======================================================================================
    // ✅ 정보 수정 요청
    // =======================================================================================
    const handleUpdate = async () => {
        try {
            const res = await updateDeveloper(token, form);
            if (res.data) alert('✅ 정보 수정 완료');
        } catch (err) {
            console.error('❌ 수정 실패', err);
            alert('수정 실패');
        }
    };

    // =======================================================================================
    // ✅ 상태코드 변경 요청
    // =======================================================================================
    const handleStateUpdate = async () => {
        try {
            const res = await updateDeveloperState(token, {
                dno: form.dno,
                dstate: newState
            });
            if (res.data) alert('✅ 상태코드 변경 완료');
        } catch (err) {
            console.error('❌ 상태 변경 실패', err);
            alert('상태 변경 실패');
        }
    };

    if (!dev) return <p style={{ color: '#666' }}>로딩 중...</p>;

    // =======================================================================================
    // ✅ UI 렌더링
    // =======================================================================================
    return (
        <Box sx={{ px: 3, py: 3, bgcolor: '#fff', color: '#212529' }}>
            {/* ✅ 타이틀 */}
            <Typography level="h3" sx={{ mb: 2, color: '#12b886', fontWeight: 'bold' }}>
                👨‍💻 개발자 상세 정보
            </Typography>

            <Divider sx={{ mb: 3, borderColor: '#ced4da' }} />

            {/* ✅ 입력 폼 카드 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 480,
                    p: 3,
                    borderRadius: 'lg',
                    bgcolor: '#f8f9fa',
                    border: '1px solid #ced4da',
                    boxShadow: 'sm'
                }}
            >
                <Input
                    name="dname"
                    value={form.dname || ''}
                    onChange={handleChange}
                    placeholder="이름"
                />
                <Input
                    name="demail"
                    value={form.demail || ''}
                    onChange={handleChange}
                    placeholder="이메일"
                />
                <Input
                    name="dphone"
                    value={form.dphone || ''}
                    onChange={handleChange}
                    placeholder="전화번호"
                />

                {/* ✅ 상태코드 셀렉트 */}
                <Box>
                    <Typography level="body-sm" sx={{ mb: 1, color: '#495057' }}>
                        상태코드 변경
                    </Typography>
                    <Select
                        value={newState}
                        onChange={(e, val) => setNewState(val)}
                        sx={{ minWidth: 180 }}
                    >
                        <Option value={0}>대기 (0)</Option>
                        <Option value={1}>승인 (1)</Option>
                        <Option value={9}>삭제 (9)</Option>
                    </Select>
                </Box>

                {/* ✅ 버튼 그룹 */}
                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                        onClick={handleUpdate}
                        variant="outlined"
                        sx={{
                            borderColor: '#12b886',
                            color: '#12b886',
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
                        variant="outlined"
                        sx={{
                            borderColor: '#339af0',
                            color: '#339af0',
                            fontWeight: 'bold',
                            '&:hover': {
                                bgcolor: '#339af0',
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