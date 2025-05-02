// ProjectJoinDetail.jsx | rw 25-05-02 (최종 리팩토링)
// [설명] 관리자 전용 프로젝트 신청 상세 정보 페이지
//        - 상세조회 + 상태코드 수정 + 삭제 기능 제공
//        - Joy UI + 블랙&핑크 테마 반영

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    getProjectJoinDetail,
    updateProjectJoin,
    deleteProjectJoin
} from '../../api/projectJoinApi';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Typography,
    Card,
    Box,
    Divider,
    Button,
    Select,
    Option,
    Modal,
    ModalDialog,
    ModalClose
} from '@mui/joy';

export default function ProjectJoinDetail() {
    const { pjno } = useParams();                         // ✅ 신청 번호 추출
    const navigate = useNavigate();                       // ✅ 페이지 이동 함수
    const token = localStorage.getItem('token');          // ✅ 관리자 인증 토큰

    const [pj, setPj] = useState(null);                   // ✅ 상세 정보 상태
    const [newType, setNewType] = useState();             // ✅ 상태코드 변경용
    const [open, setOpen] = useState(false);              // ✅ 삭제 확인 모달

    // ✅ 신청 상세 조회 API 호출
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getProjectJoinDetail(pjno, token);
                setPj(res.data);
                setNewType(res.data.pjtype);
            } catch (err) {
                alert('신청 상세 조회 실패');
            }
        };
        fetchDetail();
    }, [pjno, token]);

    // ✅ 상태코드 수정 요청
    const handleUpdate = async () => {
        try {
            const res = await updateProjectJoin(token, {
                ...pj,
                pjtype: newType
            });
            if (res.data) alert('상태코드 수정 완료');
        } catch (err) {
            alert('상태 수정 실패');
        }
    };

    // ✅ 삭제 확정 처리
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteProjectJoin(pjno, token);
            if (res.data) {
                alert('신청 삭제 완료');
                navigate('/admin/project-join');
            }
        } catch (err) {
            alert('삭제 실패');
        } finally {
            setOpen(false);
        }
    };

    // ✅ 로딩 중 처리
    if (!pj) return <p style={{ color: '#fff' }}>로딩 중...</p>;

    return (
        <div>
            {/* ✅ 페이지 제목 */}
            <Typography level="h3" sx={{ mb: 2, color: '#FF4081', fontWeight: 'bold' }}>
                🤝 프로젝트 신청 상세
            </Typography>

            {/* ✅ 신청 정보 카드 */}
            <Card variant="outlined" sx={{ p: 3, bgcolor: '#1e1e1e', borderColor: '#ff4081', color: '#fff' }}>
                <Typography level="title-md" sx={{ color: '#ff4081' }}>신청번호 #{pj.pjno}</Typography>
                <Divider sx={{ my: 2, borderColor: '#333' }} />
                <Box sx={{ mb: 2, fontSize: 14 }}>
                    <p><strong>프로젝트 번호:</strong> {pj.pno}</p>
                    <p><strong>개발자 번호:</strong> {pj.dno}</p>
                    <p><strong>현재 상태코드:</strong> {pj.pjtype}</p>
                </Box>

                <Typography level="body-md" sx={{ mb: 1, color: '#ff80ab' }}>상태코드 변경</Typography>
                <Select
                    value={newType}
                    onChange={(e, val) => setNewType(val)}
                    sx={{ width: 200, bgcolor: '#000', color: '#fff' }}
                >
                    <Option value={0}>대기 (0)</Option>
                    <Option value={1}>승인 (1)</Option>
                    <Option value={2}>거절 (2)</Option>
                </Select>

                {/* ✅ 버튼 그룹 */}
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button
                        onClick={handleUpdate}
                        variant="outlined"
                        sx={{ borderColor: '#ff4081', color: '#ff4081', '&:hover': { bgcolor: '#ff4081', color: '#000' } }}
                    >
                        상태 수정
                    </Button>
                    <Button color="danger" onClick={() => setOpen(true)}>삭제</Button>
                </Box>
            </Card>

            {/* ✅ 삭제 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog" sx={{ bgcolor: '#1e1e1e', color: '#fff' }}>
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#ff4081' }}>정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 신청은 복구할 수 없습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="soft" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDeleteConfirm}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </div>
    );
}
