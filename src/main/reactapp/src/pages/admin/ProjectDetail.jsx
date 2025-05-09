// =======================================================================================
// ProjectDetail.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전용 프로젝트 상세 페이지 (상세 조회 + 수정 가능)
// - Joy UI 기반 / ChatGPT 스타일 흰 배경 + 절제된 포인트 색상
// - API: getProjectDetail(pno), updateProject(token, form)
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectDetail, updateProject } from '../../api/projectApi.js';
import { Typography, Box, Input, Button, Divider } from '@mui/joy';

export default function ProjectDetail() {
    const { pno } = useParams();                          // ✅ URL에서 프로젝트 번호 추출
    const [project, setProject] = useState(null);         // ✅ 원본 프로젝트 데이터
    const [form, setForm] = useState({});                 // ✅ 입력 폼 상태값
    const token = localStorage.getItem('token');          // ✅ 인증 토큰

    // =======================================================================================
    // ✅ 프로젝트 상세 데이터 조회 (최초 마운트 시 실행)
    // =======================================================================================
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getProjectDetail(token,pno);
                setProject(res.data);       // 원본 저장
                setForm(res.data);          // 수정폼 초기화
            } catch (err) {
                alert('❗ 프로젝트 상세 조회 실패');
            }
        };
        fetchDetail();
    }, [token, pno]);

    // =======================================================================================
    // ✅ 입력 필드 변경 처리
    // =======================================================================================
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // =======================================================================================
    // ✅ 수정 요청 처리
    // =======================================================================================
    const handleUpdate = async () => {
        try {
            const res = await updateProject(token, form);
            if (res.data) {
                alert('✅ 수정 완료');
            } else {
                alert('❗ 서버 응답 없음');
            }
        } catch (err) {
            alert('❗ 수정 중 오류 발생');
            console.error(err);
        }
    };

    // =======================================================================================
    // ✅ 로딩 중 처리
    // =======================================================================================
    if (!project) return <Typography level="body-md">로딩 중...</Typography>;

    return (
        <div>
            {/* ✅ 페이지 제목 */}
            <Typography
                level="h3"
                sx={{ mb: 2, color: '#087f5b', fontWeight: 'bold' }}
            >
                📁 프로젝트 상세
            </Typography>

            <Divider sx={{ mb: 3, borderColor: '#ced4da' }} />

            {/* ✅ 수정 입력 폼 */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    maxWidth: 500,
                    p: 3,
                    bgcolor: '#ffffff',
                    borderRadius: 'lg',
                    border: '1px solid #dee2e6',
                    boxShadow: 'sm',
                }}
            >
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
                    placeholder="간단 소개"
                />
                <Input
                    name="pcomment"
                    value={form.pcomment || ''}
                    onChange={handleChange}
                    placeholder="상세 설명"
                />
                <Input
                    name="pcount"
                    type="number"
                    value={form.pcount || ''}
                    onChange={handleChange}
                    placeholder="모집 인원"
                />

                {/* ✅ 수정 버튼 */}
                <Button
                    onClick={handleUpdate}
                    color="primary"
                    variant="solid"
                    sx={{
                        mt: 2,
                        fontWeight: 'bold',
                        bgcolor: '#12b886',
                        '&:hover': { bgcolor: '#0ca678' }
                    }}
                >
                    수정하기
                </Button>
            </Box>
        </div>
    );
}