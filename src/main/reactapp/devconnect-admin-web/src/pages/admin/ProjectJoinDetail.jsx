// ProjectJoinDetail.jsx | rw 25-05-01
// [설명] 프로젝트 신청 상세조회 화면
//        - 신청 정보 출력 + 상태코드 수정 + 삭제 기능
//        - 삭제 시 확인용 MUI 모달 포함

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // [1] URL 파라미터, 페이지 이동용
import {
    getProjectJoinDetail,           // [2-1] 프로젝트 신청 상세조회 API
    updateProjectJoin,              // [2-2] 상태코드 수정 API
    deleteProjectJoin               // [2-3] 신청 삭제 API
} from '../../api/projectJoinApi';

import AdminLayout from '../../layouts/AdminLayout'; // [3] 관리자 공통 레이아웃 (Sidebar + Header 포함)

import {
    Typography, Card, Box, Divider, Button, Select, Option,
    Modal, ModalDialog, ModalClose                         // [4] Joy UI 컴포넌트 (삭제 확인용 모달 포함)
} from '@mui/joy';

export default function ProjectJoinDetail() {
    const { pjno } = useParams();                       // [5] URL로부터 신청번호 추출
    const [pj, setPj] = useState(null);                 // [6] 상세 신청 객체 상태
    const [newType, setNewType] = useState();           // [7] 상태코드 select 상태값
    const [open, setOpen] = useState(false);            // [8] 삭제 확인 모달 열림 여부
    const navigate = useNavigate();                     // [9] 페이지 이동 함수
    const token = localStorage.getItem('token');        // [10] 로컬스토리지에서 JWT 토큰 추출

    // [11] 마운트 시 신청 상세 데이터 불러오기
    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await getProjectJoinDetail(pjno, token); // (1) 신청 번호 기반 상세 조회
                setPj(res.data);                                     // (2) 조회 결과 상태 저장
                setNewType(res.data.pjtype);                         // (3) 초기 상태코드 설정
            } catch (err) {
                alert('상세 조회 실패'); // 예외 처리
            }
        };
        fetchDetail();
    }, [pjno, token]);

    // [12] 신청 상태코드 수정 요청
    const handleUpdate = async () => {
        try {
            const res = await updateProjectJoin(token, { ...pj, pjtype: newType });
            if (res.data) alert('수정 성공');
        } catch (err) {
            alert('수정 실패');
        }
    };

    // [13] 삭제 최종 확인 후 삭제 API 요청
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteProjectJoin(pjno, token);
            if (res.data) {
                alert('삭제 성공');
                navigate('/admin/project-join'); // 목록 페이지로 이동
            }
        } catch (err) {
            alert('삭제 실패');
        } finally {
            setOpen(false); // 모달 닫기
        }
    };

    if (!pj) return null; // 로딩 전 렌더 차단

    return (
        <AdminLayout>
            <Typography level="h3" sx={{ mb: 2 }}>프로젝트 신청 상세</Typography>

            {/* [14] 신청 정보 카드 */}
            <Card variant="outlined">
                <Typography level="title-md">신청번호 #{pj.pjno}</Typography>
                <Divider sx={{ my: 1 }} />
                <Box>
                    <p><strong>프로젝트번호:</strong> {pj.pno}</p>
                    <p><strong>개발자번호:</strong> {pj.dno}</p>
                    <p><strong>현재 상태코드:</strong> {pj.pjtype}</p>
                    <p><strong>변경 상태코드:</strong></p>

                    {/* [15] 상태코드 선택 드롭다운 */}
                    <Select value={newType} onChange={(e, val) => setNewType(val)}>
                        <Option value={0}>대기(0)</Option>
                        <Option value={1}>승인(1)</Option>
                        <Option value={2}>거절(2)</Option>
                    </Select>
                </Box>

                {/* [16] 버튼 영역 - 수정 및 삭제 */}
                <Box sx={{ mt: 2 }}>
                    <Button onClick={handleUpdate} sx={{ mr: 1 }}>수정</Button>
                    <Button color="danger" onClick={() => setOpen(true)}>삭제</Button> {/* 삭제 전 모달 열기 */}
                </Box>
            </Card>

            {/* [17] 삭제 확인용 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog">
                    <ModalClose /> {/* 닫기 버튼 (X) */}
                    <Typography level="h4">정말 삭제하시겠습니까?</Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 신청은 복구할 수 없습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="soft" onClick={() => setOpen(false)}>취소</Button>
                        <Button color="danger" onClick={handleDeleteConfirm}>삭제</Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </AdminLayout>
    );
}