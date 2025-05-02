// =======================================================================================
// AdminList.jsx | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자 전체 목록 조회 화면
// - Joy UI 기반 테이블 사용
// - 관리자 삭제 기능 포함
// - ChatGPT 스타일 반영: 흰 배경 + 녹색 포인트 + 절제된 디자인
// =======================================================================================

import React, { useEffect, useState } from 'react';
import { getAdminList, deleteAdmin } from '../../api/adminApi';   // ✅ API 연동
import {
    Box,
    Typography,
    Table,
    Button
} from '@mui/joy';
import { FaTrash } from 'react-icons/fa';
import StatusBadge from '../../components/StatusBadge';           // ✅ 상태 뱃지 컴포넌트

export default function AdminList() {
    const [adminList, setAdminList] = useState([]); // ✅ 관리자 목록 상태

    // =======================================================================================
    // ✅ 관리자 전체 조회 함수
    // =======================================================================================
    const loadAdmins = async () => {
        try {
            const res = await getAdminList();       // GET /admin
            setAdminList(res.data);
        } catch (err) {
            console.error('관리자 목록 조회 실패:', err);
        }
    };

    // =======================================================================================
    // ✅ 관리자 삭제 처리 함수
    // =======================================================================================
    const handleDelete = async (adid) => {
        if (!window.confirm(`관리자 ${adid} 를 삭제하시겠습니까?`)) return;
        try {
            await deleteAdmin(adid);               // DELETE /admin?adid={adid}
            loadAdmins();                          // 삭제 후 목록 갱신
        } catch (err) {
            console.error('삭제 실패:', err);
        }
    };

    // ✅ 초기 마운트 시 전체 목록 조회
    useEffect(() => {
        loadAdmins();
    }, []);

    return (
        <Box sx={{ px: 2, py: 3 }}>
            {/* ✅ 페이지 타이틀 */}
            <Typography
                level="h3"
                sx={{
                    mb: 3,
                    fontWeight: 'bold',
                    color: '#12b886',         // ✅ 채도 낮은 녹색 포인트
                }}
            >
                👥 관리자 목록
            </Typography>

            {/* ✅ 관리자 목록 테이블 */}
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
                            <td>
                                <StatusBadge code={admin.adtype} type="admin" />
                            </td>
                            <td>{admin.createAt}</td>
                            <td>
                                <Button
                                    size="sm"
                                    color="neutral"
                                    variant="outlined"
                                    onClick={() => handleDelete(admin.adid)}
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
        </Box>
    );
}