// =======================================================================================
// CratingDetail.jsx | rw 25-05-03 수정 반영 (Update.jsx 제거)
// [설명]
// - 기업 평가 상세 조회 + 수정 + 승인 화면 (하나로 통합)
// - ✅ 제목/내용/점수/상태/등록일 표시 및 수정 가능
// - ✅ 상태 승인 처리 버튼 포함 (crstate = 1)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Card, Divider, Button, Input, Textarea, Select, Option
} from '@mui/joy';
import { getCratingDetail, updateCrating } from '../../api/cratingApi';
import StatusBadge from '../../components/StatusBadge';

export default function CratingDetail() {
    const { crno } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getCratingDetail(token, crno);
                setForm(res.data);
            } catch {
                alert('상세 조회 실패');
            }
        };
        fetch();
    }, [crno]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        try {
            const result = await updateCrating(token, form);
            if (result.data) alert('수정 완료');
            else alert('수정 실패');
        } catch {
            alert('에러 발생');
        }
    };

    const handleApprove = async () => {
        const token = localStorage.getItem('token');
        try {
            const result = await updateCrating(token, { ...form, crstate: 1 });
            if (result.data) {
                alert('승인 완료');
                setForm(prev => ({ ...prev, crstate: 1 }));
            } else alert('승인 실패');
        } catch {
            alert('에러 발생');
        }
    };

    if (!form) return <Typography>로딩 중...</Typography>;

    return (
        <Box sx={{ px: 3, py: 3 }}>
            <Typography level="h3" sx={{ mb: 2 }}>📄 기업 평가 상세</Typography>

            <Card>
                <Input name="ctitle" value={form.ctitle} onChange={handleChange} sx={{ mb: 1 }} />
                <Divider />
                <Textarea name="ccontent" value={form.ccontent} onChange={handleChange} minRows={4} sx={{ mt: 1 }} />

                <Box sx={{ mt: 2 }}>
                    <p><strong>점수:</strong>
                        <Select name="crscore" value={form.crscore} onChange={(_, val) => setForm(f => ({ ...f, crscore: val }))}>
                            {[1, 2, 3, 4, 5].map(score => <Option key={score} value={score}>{score}점</Option>)}
                        </Select>
                    </p>
                    <p><strong>상태:</strong> <StatusBadge code={form.crstate} type="crating" /></p>
                    <p><strong>등록일:</strong> {form.createAt?.split('T')[0]}</p>
                    <p><strong>프로젝트번호:</strong> {form.pno}</p>
                    <p><strong>개발자번호:</strong> {form.dno}</p>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button variant="soft" color="primary" onClick={handleUpdate}>수정</Button>
                    {form.crstate !== 1 && (
                        <Button variant="soft" color="success" onClick={handleApprove}>승인 처리</Button>
                    )}
                    <Button variant="plain" onClick={() => navigate(-1)}>목록</Button>
                </Box>
            </Card>
        </Box>
    );
}
