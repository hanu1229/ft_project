// =======================================================================================
// ProjectJoinDetail.jsx | rw 25-05-03 리팩토링
// [설명]
// - 관리자 전용 프로젝트 신청 상세 페이지
// - 신청 상세 조회는 제거 (백엔드 미제공)
// - 상태코드 수정 + 삭제 기능만 구현
// =======================================================================================

import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateProjectJoin, deleteProjectJoin } from '../../api/projectJoinApi';
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
    const { pjno } = useParams();                    // ✅ 신청 번호
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // ✅ 기본 값 수동 설정 (조회 API가 없으므로)
    const [pjtype, setPjtype] = useState(0);         // 상태코드 기본값
    const [open, setOpen] = useState(false);         // 삭제 확인 모달

    // ✅ 수동 입력용 상태 (실 사용시 QueryParam 통해 넘겨받는 구조 권장)
    const [pno, setPno] = useState('');
    const [dno, setDno] = useState('');

    // =======================================================================================
    // ✅ 상태코드 수정 요청
    // =======================================================================================
    const handleUpdate = async () => {
        try {
            const res = await updateProjectJoin(token, {
                pjno: Number(pjno),
                pno: Number(pno),
                dno: Number(dno),
                pjtype: Number(pjtype)
            });
            if (res.data) alert('✅ 상태코드 수정 완료');
            else alert('❗ 수정 실패');
        } catch (err) {
            alert('❗ 오류 발생');
            console.error(err);
        }
    };

    // =======================================================================================
    // ✅ 삭제 요청
    // =======================================================================================
    const handleDeleteConfirm = async () => {
        try {
            const res = await deleteProjectJoin(token, pjno);
            if (res.data) {
                alert('✅ 삭제 완료');
                navigate('/admin/project-join');
            }
        } catch (err) {
            alert('❗ 삭제 실패');
            console.error(err);
        } finally {
            setOpen(false);
        }
    };

    return (
        <div>
            <Typography level="h3" sx={{ mb: 2, color: '#087f5b', fontWeight: 'bold' }}>
                🤝 프로젝트 신청 상세 (수정/삭제)
            </Typography>

            <Card variant="outlined" sx={{ p: 3, maxWidth: 480, bgcolor: '#fff' }}>
                <Typography level="title-md" sx={{ color: '#12b886' }}>
                    신청번호 #{pjno}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* ✅ 수동 입력 (조회 API 없음) */}
                <Box sx={{ fontSize: 14 }}>
                    <p>
                        <strong>프로젝트 번호:</strong>{' '}
                        <input value={pno} onChange={(e) => setPno(e.target.value)} />
                    </p>
                    <p>
                        <strong>개발자 번호:</strong>{' '}
                        <input value={dno} onChange={(e) => setDno(e.target.value)} />
                    </p>
                    <p>
                        <strong>상태코드:</strong>{' '}
                        <Select
                            value={pjtype}
                            onChange={(e, val) => setPjtype(val)}
                            sx={{ width: 200 }}
                        >
                            <Option value={0}>대기 (0)</Option>
                            <Option value={1}>승인 (1)</Option>
                            <Option value={2}>거절 (2)</Option>
                        </Select>
                    </p>
                </Box>

                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                    <Button onClick={handleUpdate} variant="outlined" color="success">
                        상태 수정
                    </Button>
                    <Button variant="soft" color="danger" onClick={() => setOpen(true)}>
                        삭제
                    </Button>
                </Box>
            </Card>

            {/* ✅ 삭제 확인 모달 */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <ModalDialog variant="outlined" role="alertdialog" sx={{ bgcolor: '#fff' }}>
                    <ModalClose />
                    <Typography level="h4" sx={{ color: '#e03131' }}>
                        정말 삭제하시겠습니까?
                    </Typography>
                    <Typography level="body-sm" sx={{ my: 1 }}>
                        삭제된 신청 정보는 복구할 수 없습니다.
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button variant="soft" onClick={() => setOpen(false)}>
                            취소
                        </Button>
                        <Button color="danger" onClick={handleDeleteConfirm}>
                            삭제
                        </Button>
                    </Box>
                </ModalDialog>
            </Modal>
        </div>
    );
}