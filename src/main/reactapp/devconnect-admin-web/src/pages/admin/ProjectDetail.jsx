// ProjectDetail.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 전용 프로젝트 상세 조회 및 수정 화면
//        - Joy UI 기반, 넷플릭스 테마 적용
//        - 프로젝트 번호 (pno) 기준 조회 및 수정 기능 포함

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectDetail, updateProject } from '../../api/projectApi';
import AdminLayout from '../../layouts/AdminLayout';
import { Typography, Box, Input, Button, Divider } from '@mui/joy';

export default function ProjectDetail() {
    const { pno } = useParams();                          // ✅ URL 파라미터: 프로젝트 번호
    const [project, setProject] = useState(null);         // ✅ 원본 프로젝트 데이터
    const [form, setForm] = useState({});                 // ✅ 수정용 상태 객체
    const token = localStorage.getItem('token');          // ✅ 인증 토큰

    // ✅ 프로젝트 상세 조회 (최초 1회 실행)
    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await getProjectDetail(pno);
                setProject(res.data);
                setForm(res.data); // 상태 초기화
            } catch (err) {
                alert('프로젝트 상세 조회 실패');
            }
        };
        fetchProject();
    }, [pno]);

    // ✅ 입력 필드 변경 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // ✅ 수정 요청
    const handleUpdate = async () => {
        try {
            const res = await updateProject(token, form);
            if (res.data) {
                alert('수정이 완료되었습니다.');
            } else {
                alert('수정 실패: 서버 응답 없음');
            }
        } catch (err) {
            alert('수정 중 오류 발생');
        }
    };

    if (!project) return <p style={{ color: '#fff' }}>로딩 중...</p>;

    return (
        <div>
            {/* ✅ 제목 */}
            <Typography
                level="h3"
                sx={{ mb: 2, color: '#FF4081', fontWeight: 'bold' }}
            >
                📁 프로젝트 상세
            </Typography>
            <Divider sx={{ mb: 3, borderColor: '#FF4081' }} />

            {/* ✅ 수정 입력 폼 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 500,
                    bgcolor: '#1e1e1e',
                    p: 3,
                    borderRadius: 'lg',
                    border: '1px solid #ff4081',
                    boxShadow: '0 0 20px rgba(255,64,129,0.2)',
                    color: '#fff'
                }}
            >
                <Input
                    name="pname"
                    value={form.pname || ''}
                    onChange={handleChange}
                    placeholder="프로젝트명"
                    sx={{ bgcolor: '#000', color: '#fff' }}
                />
                <Input
                    name="pintro"
                    value={form.pintro || ''}
                    onChange={handleChange}
                    placeholder="간단 소개"
                    sx={{ bgcolor: '#000', color: '#fff' }}
                />
                <Input
                    name="pcomment"
                    value={form.pcomment || ''}
                    onChange={handleChange}
                    placeholder="상세 설명"
                    sx={{ bgcolor: '#000', color: '#fff' }}
                />
                <Input
                    name="pcount"
                    type="number"
                    value={form.pcount || ''}
                    onChange={handleChange}
                    placeholder="모집 인원"
                    sx={{ bgcolor: '#000', color: '#fff' }}
                />

                {/* ✅ 수정 버튼 */}
                <Button
                    onClick={handleUpdate}
                    color="danger"
                    variant="solid"
                    sx={{
                        mt: 2,
                        bgcolor: '#FF4081',
                        '&:hover': { bgcolor: '#e91e63' }
                    }}
                >
                    수정
                </Button>
            </Box>
        </div>
    );
}
