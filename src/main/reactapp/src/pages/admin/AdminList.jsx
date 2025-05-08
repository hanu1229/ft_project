// =======================================================================================
// AdminList.jsx | rw 25-05-08 리팩토링 - ConfirmDeleteModal 공용화 적용
// [설명]
// - 관리자 전체 목록 조회 화면
// - Joy UI 기반 테이블 사용
// - 공용 삭제 모달 및 상태 뱃지 적용
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { getAdminList, deleteAdmin } from '../../api/adminApi.js';
import {
    Box,
    Typography,
    Table,
    Button
} from '@mui/joy';
import { FaTrash } from 'react-icons/fa';
import StatusBadge from '../../components/StatusBadge.jsx';       // ✅ 상태 뱃지
import ConfirmDeleteModal from '../../components/ConfirmDeleteModal.jsx'; // ✅ 공용 삭제 모달

export default function AdminList() {
    const [adminList, setAdminList] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [open, setOpen] = useState(false);

    // =======================================================================================
    // ✅ 관리자 전체 조회 함수
    // =======================================================================================
    const loadAdmins = async () => {
        try {
            const res = await getAdminList();
            setAdminList(res.data);
        } catch (err) {
            console.error('관리자 목록 조회 실패:', err);
        }
    };

    // =======================================================================================
    // ✅ 관리자 삭제 함수
    // =======================================================================================
    const handleDelete = async () => {
        try {
            await deleteAdmin(deleteTarget);
            loadAdmins();
            setOpen(false);
        } catch (err) {
            console.error('삭제 실패:', err);
        }
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    return (
        <Box sx={{ px: 2, py: 3 }}>
            <Typography level="h3" sx={{ mb: 3, fontWeight: 'bold', color: '#12b886' }}>
                👥 관리자 목록
            </Typography>

            <Box sx={{ overflowX: 'auto' }}>
                <Table
                    variant="plain"
                    size="sm"
                    stickyHeader
                    sx={{
                        bgcolor: '#ffffff',
                        color: '#212529',
                        border: '1px solid #dee2e6',
                        '& th': {
                            bgcolor: '#f1f3f5',
                            color: '#343a40',
                            fontWeight: 600,
                            borderBottom: '1px solid #ced4da',
                            fontSize: '14px'
                        },
                        '& td': {
                            borderBottom: '1px solid #f1f3f5',
                            fontSize: '13.5px',
                            color: '#495057'
                        },
                    }}
                >
                    <thead>
                    <tr>
                        <th>번호</th>
                        <th>아이디</th>
                        <th>이름</th>
                        <th>전화번호</th>
                        <th>상태</th>
                        <th>가입일</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {adminList.map((admin, idx) => (
                        <tr key={idx}>
                            <td>{admin.adno}</td>
                            <td>{admin.adid}</td>
                            <td>{admin.adname}</td>
                            <td>{admin.adphone}</td>
                            <td><StatusBadge code={admin.adtype} type="admin" /></td>
                            <td>{admin.createAt}</td>
                            <td>
                                <Button
                                    size="sm"
                                    color="neutral"
                                    variant="outlined"
                                    onClick={() => {
                                        setDeleteTarget(admin.adid);
                                        setOpen(true);
                                    }}
                                    sx={{
                                        borderColor: '#ced4da',
                                        color: '#868e96',
                                        '&:hover': {
                                            bgcolor: '#ffe3e3',
                                            color: '#c92a2a',
                                            borderColor: '#fa5252'
                                        }
                                    }}
                                >
                                    <FaTrash />
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Box>

            {/* ✅ 삭제 확인 모달 */}
            <ConfirmDeleteModal
                open={open}
                onClose={() => setOpen(false)}
                onConfirm={handleDelete}
                title="관리자 삭제"
                description="삭제된 관리자는 복구할 수 없습니다."
            />
        </Box>
    );
}
