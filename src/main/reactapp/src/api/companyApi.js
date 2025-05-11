// =======================================================================================
// companyApi.js | rw 25-05-02 최종 리팩토링
// [설명]
// - 관리자(Admin) 권한으로 기업(Company) 정보를 조회, 수정, 삭제할 수 있는 API 함수 모음
// - 모든 요청은 공통 인스턴스(axiosInstance.js)의 baseURL(`/api`)를 기준으로 상대경로 작성됨
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 인스턴스 기반 요청 (baseURL = /api)


// =======================================================================================
// ✅ 1. 관리자 기반 기업 전체 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/company/findall
- 요청 데이터: 없음
- 요청 헤더: 없음
- 응답 데이터: List<CompanyDto>
*/
export const getCompanyList = () => {
    return axios.get('/company/findall');
};

// =======================================================================================
// ✅ 2. 관리자 기반 기업 상세 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/admin/company/detail?cno={cno}
- 요청 파라미터: cno (Query Param)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: CompanyDto
*/
export const getCompanyDetail = (token, cno) => {
    return axios.get(`/admin/company/detail?cno=${cno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};

// =======================================================================================
// ✅ 3. 관리자 기반 기업 정보 수정 요청 (FormData 전송 방식)
// =======================================================================================
/*
- 매핑 방식: PUT
- 요청 URL: /api/admin/company/update
- 요청 데이터: CompanyDto (multipart/form-data 형식)
- 요청 헤더: Authorization: Bearer {token}, Content-Type: multipart/form-data
- 응답 데이터: Boolean (true = 성공, false = 실패)

- 설명:
• 관리자 권한으로 기업 정보를 수정하는 요청을 보냅니다.
• 수정 가능한 필드: cname, cphone, cadress, cemail, cbusiness
• 선택적 수정 항목: 비밀번호(upcpwd), 프로필 이미지(file)
• 파일이 있을 경우 서버에서 이미지 업로드 수행
*/
export const updateCompany = (token, formData) => {
    return axios.put('/admin/company/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};

// =======================================================================================
// ✅ 4. 관리자 기반 기업 삭제
/*
- 매핑 방식: PUT (논리 삭제 또는 보안상 이유로 PUT 사용)
- 요청 URL: /admin/company/delete?cno={cno}
- 요청 파라미터: cno (Query Param)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Boolean
*/
export const deleteCompany = (cno, token) => {
    return axios.put(`/admin/company/delete?cno=${cno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};