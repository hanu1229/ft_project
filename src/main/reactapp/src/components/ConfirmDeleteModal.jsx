// =======================================================================================
// ConfirmDeleteModal.jsx | 공통 삭제 확인 모달 컴포넌트
// - 사용예: ProjectJoin, Company, Developer 등에서 삭제 버튼 클릭 시 사용
// =======================================================================================

import React from 'react';
import {
    Modal,
    ModalDialog,
    ModalClose,
    Typography,
    Box,
    Button
} from '@mui/joy';

/**
 * 공통 삭제 확인 모달
 * @param {boolean} open - 모달 오픈 여부
 * @param {function} onClose - 닫기 이벤트 핸들러
 * @param {function} onConfirm - 삭제 확정 이벤트 핸들러
 * @returns JSX.Element
 */
export default function ConfirmDeleteModal({ open, onClose, onConfirm }) {
    return (
        <Modal open={open} onClose={onClose}>
            <ModalDialog
                variant="outlined"
                role="alertdialog"
                sx={{ bgcolor: '#fff', color: '#212529' }}
            >
                <ModalClose />
                <Typography level="h4" sx={{ color: '#e03131' }}>
                    정말 삭제하시겠습니까?
                </Typography>
                <Typography level="body-sm" sx={{ my: 1 }}>
                    삭제된 데이터는 복구할 수 없습니다.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button variant="soft" onClick={onClose}>취소</Button>
                    <Button color="danger" onClick={onConfirm}>삭제</Button>
                </Box>
            </ModalDialog>
        </Modal>
    );
}
