// ProjectDetail.jsx | rw 25-05-01
// [설명] 프로젝트 상세 조회 및 수정 기능 포함
//        - pno 기반으로 프로젝트 상세 정보를 조회
//        - 각 필드(Input)를 수정 후 "수정" 버튼 클릭 시 updateProject API 요청

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';                // [1] URL 파라미터 추출용 hook
import { getProjectDetail, updateProject } from '../../api/projectApi'; // [2] 프로젝트 상세조회 + 수정 API
import AdminLayout from '../../layouts/AdminLayout';         // [3] 관리자용 공통 레이아웃 (Sidebar 포함)

import {
    Typography, Box, Input, Button, Divider                  // [4] Joy UI 컴포넌트
} from '@mui/joy';

export default function ProjectDetail() {
    const { pno } = useParams();                        // [5] URL에서 pno 추출 (프로젝트 고유번호)
    const [project, setProject] = useState(null);       // [6] 서버에서 조회한 원본 프로젝트 데이터
    const [form, setForm] = useState({});               // [7] 수정 대상 form 상태

    // [8] pno 기준 프로젝트 상세조회 → 상태 저장
    useEffect(() => {
        const fetchDetail = async () => {
            const res = await getProjectDetail(pno);   // (1) API 요청
            setProject(res.data);                      // (2) 원본 상태 저장
            setForm(res.data);                         // (3) 수정용 상태 동기화
        };
        fetchDetail();
    }, [pno]);

    // [9] Input 값 변경 핸들러
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value }); // (1) name 속성 기준으로 값 변경 반영
    };

    // [10] 수정 버튼 클릭 시 API 요청
    const handleUpdate = async () => {
        const token = localStorage.getItem('token');            // (1) 토큰 추출
        const res = await updateProject(token, form);           // (2) 수정 요청
        if (res.data) alert('수정 완료');                       // (3) 성공 여부 알림
        else alert('수정 실패');
    };

    if (!project) return <p>로딩 중...</p>; // [11] 조회 전 로딩 처리

    return (
        <AdminLayout>
            {/* [12] 페이지 타이틀 */}
            <Typography level="h3">프로젝트 상세</Typography>
            <Divider sx={{ my: 2 }} />

            {/* [13] 수정 입력 필드 + 버튼 */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Input
                    name="pname"
                    value={form.pname || ''}
                    onChange={handleChange}
                    placeholder="프로젝트명"
                />
                <Input
                    name="pintro"
                    value={form.pintro || ''}
                    onChange={handleChange}
                    placeholder="소개"
                />
                <Input
                    name="pcomment"
                    value={form.pcomment || ''}
                    onChange={handleChange}
                    placeholder="설명"
                />
                <Input
                    name="pcount"
                    value={form.pcount || ''}
                    onChange={handleChange}
                    placeholder="모집인원"
                />
                <Button onClick={handleUpdate}>수정</Button>
            </Box>
        </AdminLayout>
    );
}