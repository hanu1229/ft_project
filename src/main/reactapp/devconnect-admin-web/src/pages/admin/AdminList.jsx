// AdminList.jsx | rw 25-05-01
// [설명] 전체 관리자 목록을 조회하고 테이블로 출력하는 화면

import React, { useEffect, useState } from 'react';
import { getAdminList, deleteAdmin } from '../../api/adminApi';
import AdminLayout from '../../layouts/AdminLayout';
import {
    Box,
    Typography,
    Table,
    thead,
    tbody,
    tr,
    td,
    th,
    Button,
    Chip,
} from '@mui/joy';
import { FaTrash } from 'react-icons/fa';

export default function AdminList() {
    const [adminList, setAdminList] = useState([]);

    const loadAdmins = async () => {
        const res = await getAdminList();
        setAdminList(res.data);
    };

    const handleDelete = async (adid) => {
        if (!window.confirm(`관리자 ${adid} 를 삭제하시겠습니까?`)) return;
        await deleteAdmin(adid);
        loadAdmins();
    };

    useEffect(() => {
        loadAdmins();
    }, []);

    return (
        <AdminLayout>
            <Typography level="h3" sx={{ mb: 2 }}>
                👥 관리자 목록
            </Typography>
            <Table variant="soft" size="sm">
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
                        <td><Chip color="warning">{admin.adtype}</Chip></td>
                        <td>{admin.createAt}</td>
                        <td>
                            <Button size="sm" color="danger" onClick={() => handleDelete(admin.adid)}>
                                <FaTrash />
                            </Button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </AdminLayout>
    );
}