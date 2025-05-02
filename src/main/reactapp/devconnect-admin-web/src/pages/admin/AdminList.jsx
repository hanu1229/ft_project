// AdminList.jsx | rw 25-05-02 최종 리팩토링
// [설명] 관리자 전체 목록 조회 화면
//        - Joy UI Table 사용
//        - 관리자 삭제 기능 포함
//        - 다크 테마 + 핑크 포인트 UI 적용

import React, { useEffect, useState } from 'react';
import { getAdminList, deleteAdmin } from '../../api/adminApi';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Box,
    Typography,
    Table,
    Button
} from '@mui/joy';
import { FaTrash } from 'react-icons/fa';
import StatusBadge from '../../components/StatusBadge';

export default function AdminList() {
    const [adminList, setAdminList] = useState([]);

    // =======================================================================================
    // ✅ 관리자 전체 조회 함수
    // =======================================================================================
    const loadAdmins = async () => {
        try {
            const res = await getAdminList();
            setAdminList(res.data);
        } catch (err) {
            console.error('관리자 목록 조회 실패', err);
        }
    };

    // =======================================================================================
    // ✅ 관리자 삭제 처리 함수
    // =======================================================================================
    const handleDelete = async (adid) => {
        if (!window.confirm(`관리자 ${adid} 를 삭제하시겠습니까?`)) return;
        try {
            await deleteAdmin(adid);
            loadAdmins(); // 삭제 후 목록 재조회
        } catch (err) {
            console.error('삭제 실패:', err);
        }
    };

    // ✅ 최초 로딩 시 전체 관리자 목록 조회
    useEffect(() => {
        loadAdmins();
    }, []);

    return (
        <div>
            {/* ✅ 상단 타이틀 */}
            <Typography level="h3" sx={{ mb: 3, color: '#ff4081' }}>
                👥 관리자 목록
            </Typography>

            {/* ✅ 테이블 출력 */}
            <Box sx={{ overflowX: 'auto' }}>
                <Table
                    variant="soft"
                    size="sm"
                    borderAxis="xBetween"
                    stickyHeader
                    sx={{
                        bgcolor: '#1e1e1e',
                        color: '#fff',
                        '& th': { bgcolor: '#000', color: '#ff4081', fontWeight: 'bold' },
                        '& td': { color: '#f8bbd0' },
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
                                    color="danger"
                                    variant="outlined"
                                    onClick={() => handleDelete(admin.adid)}
                                    sx={{
                                        borderColor: '#ff4081',
                                        color: '#ff4081',
                                        '&:hover': {
                                            bgcolor: '#ff4081',
                                            color: '#000',
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
        </div>
    );
}