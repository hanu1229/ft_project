// =======================================================================================
// DratingDetail.jsx | rw 25-05-03 최종 생성
// [설명]
// - 개발자 평가 상세 조회 + 수정 + 삭제 화면
// - ✅ 백엔드 API 기준으로만 수정/삭제 구현 (드라이 상태코드 변경 불가)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    Box, Typography, Input, Button, Textarea, Sheet
} from '@mui/joy';
import { getDratingDetail, updateDrating, deleteDrating } from '../../api/dratingApi';
import StatusBadge from '../../components/StatusBadge';

export default function DratingDetail() {
    const { drno } = useParams(); // 경로에서 drno 추출
    const navigate = useNavigate();
    const [form, setForm] = useState({});

    // ✅ 상세 데이터 불러오기
    useEffect(() => {
        const fetch = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await getDratingDetail(token, drno);
                setForm(res.data);
            } catch (err) {
                alert('상세 조회 실패');
                navigate(-1);
            }
        };
        fetch();
    }, [drno]);

    // ✅ 값 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ 수정 요청
    const handleUpdate = async () => {
        const token = localStorage.getItem('token');
        const payload = {
            drno: form.drno,
            drscore: form.drscore, // 수정 가능한 항목만 전송
        };
        try {
            const res = await updateDrating(token, payload);
            if (res.data === true) {
                alert('수정 성공');
                navigate(-1);
            } else {
                alert('수정 실패');
            }
        } catch (err) {
            alert('수정 요청 오류');
        }
    };

    // ✅ 삭제 요청
    const handleDelete = async () => {
        const token = localStorage.getItem('token');
        try {
            const res = await deleteDrating(token, form.drno);
            if (res.data === true) {
                alert('삭제 성공');
                navigate(-1);
            } else {
                alert('삭제 실패');
            }
        } catch (err) {
            alert('삭제 요청 오류');
        }
    };

    return (
        <Box sx={{ px: 3, py: 3 }}>
            <Typography level="h3" sx={{ mb: 2 }}>🧑‍💻 개발자 평가 상세</Typography>

            <Sheet variant="outlined" sx={{ p: 3, mb: 3 }}>
                <Typography level="title-md">제목</Typography>
                <Input name="dtitle" value={form.dtitle || ''} readOnly sx={{ mb: 2 }} />

                <Typography level="title-md">내용</Typography>
                <Textarea minRows={4} name="dcontent" value={form.dcontent || ''} readOnly sx={{ mb: 2 }} />

                <Typography level="title-md">점수</Typography>
                <Input name="drscore" value={form.drscore || ''} onChange={handleChange} sx={{ mb: 2 }} />

                <Typography level="title-md">상태</Typography>
                <StatusBadge code={form.drstate} type="drating" />

                <Typography level="title-md" sx={{ mt: 2 }}>등록일</Typography>
                <Typography level="body-sm">{form.createAt?.split('T')[0]}</Typography>
            </Sheet>

            <Box sx={{ display: 'flex', gap: 2 }}>
                <Button color="primary" onClick={handleUpdate}>수정</Button>
                <Button color="danger" onClick={handleDelete}>삭제</Button>
                <Button onClick={() => navigate(-1)}>뒤로</Button>
            </Box>
        </Box>
    );
} // end
