// =======================================================================================
// DeveloperDetail.jsx | rw 25-05-03 최종 생성
// [설명]
// - 개발자 상세 정보 조회 + 수정 + 삭제 상태변경 화면 (관리자 전용)
// - ✅ 상세 데이터 조회
// - ✅ 프로필 이미지 출력
// - ✅ 수정 버튼 → updateDeveloper 호출
// - ✅ 삭제(상태변경) 버튼 → updateDeveloperState 호출
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Typography, Input, Button, Sheet, Stack, Avatar
} from '@mui/joy';
import {
    getDeveloperDetail,
    updateDeveloper,
    updateDeveloperState
} from '../../api/developerApi';

export default function DeveloperDetail() {
    const { dno } = useParams();
    const navigate = useNavigate();
    const [developer, setDeveloper] = useState(null);
    const [form, setForm] = useState({});

    // ✅ 데이터 조회
    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await getDeveloperDetail(dno);
                setDeveloper(res.data);
                setForm(res.data);
            } catch (err) {
                alert('개발자 조회 실패');
            }
        };
        fetch();
    }, [dno]);

    // ✅ 입력값 변경
    const onChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    // ✅ 프로필 파일 변경
    const onFileChange = (e) => {
        setForm({ ...form, dfile: e.target.files[0] });
    };

    // ✅ 수정 요청
    const onUpdate = async () => {
        const token = localStorage.getItem('token');
        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            formData.append(key, val);
        });

        const res = await updateDeveloper(token, formData);
        if (res.data) {
            alert('수정 성공');
            navigate('/admin/developer');
        } else {
            alert('수정 실패');
        }
    };

    // ✅ 삭제(상태변경) 요청
    const onDelete = async () => {
        const token = localStorage.getItem('token');
        const res = await updateDeveloperState(token, {
            dno: developer.dno,
            dstate: false
        });
        if (res.data) {
            alert('삭제 완료');
            navigate('/admin/developer');
        } else {
            alert('삭제 실패');
        }
    };

    if (!developer) return <Typography>Loading...</Typography>;

    return (
        <Box sx={{ px: 3, py: 3 }}>
            <Typography level="h3" sx={{ mb: 2 }}>👨‍💻 개발자 상세</Typography>

            <Sheet sx={{ p: 3, borderRadius: 8, maxWidth: 600 }}>
                <Stack direction="row" spacing={2}>
                    <Avatar
                        src={`/upload/${developer.dprofile}`}
                        alt="프로필"
                        sx={{ width: 100, height: 100 }}
                    />
                    <Input type="file" onChange={onFileChange} />
                </Stack>

                <Input name="dname" value={form.dname} onChange={onChange} sx={{ mt: 2 }} placeholder="이름" />
                <Input name="dphone" value={form.dphone} onChange={onChange} sx={{ mt: 1 }} placeholder="연락처" />
                <Input name="daddress" value={form.daddress} onChange={onChange} sx={{ mt: 1 }} placeholder="주소" />
                <Input name="demail" value={form.demail} onChange={onChange} sx={{ mt: 1 }} placeholder="이메일" />

                <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
                    <Button color="primary" onClick={onUpdate}>수정</Button>
                    <Button color="danger" onClick={onDelete}>삭제</Button>
                </Box>
            </Sheet>
        </Box>
    );
}
