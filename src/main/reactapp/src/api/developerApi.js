// =======================================================================================
// developerApi.js | rw 25-05-09 최종 리팩토링
// [설명]
// - 관리자(Admin) 권한으로 개발자(Developer) 정보를 조회, 수정, 삭제할 수 있는 API 함수 모음
// - 모든 요청은 공통 인스턴스(axiosInstance.js)의 baseURL(`/api`)를 기준으로 상대경로 작성됨
// =======================================================================================

import axios from './axiosInstance.js'; // ✅ 공통 인스턴스 기반 요청 (baseURL = /api)


// =======================================================================================
// ✅ 1. 관리자 기반 개발자 전체 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/developer/findall
- 요청 데이터: 없음
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: List<DeveloperDto>
*/
export const getDeveloperList = (token) => {
    return axios.get('/developer/findall', {
        headers: { Authorization: `Bearer ${token}` },
    });
};


// =======================================================================================
// ✅ 2. 관리자 기반 개발자 상세 조회
/*
- 매핑 방식: GET
- 요청 URL: /api/admin/developer/detail?dno={dno}
- 요청 파라미터: dno (Query Param)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: DeveloperDto
*/
export const getDeveloperDetail = (token, dno) => {
    return axios.get(`/admin/developer/detail?dno=${dno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};


// =======================================================================================
// ✅ 3. 관리자 기반 개발자 정보 수정 요청 (FormData 전송 방식)
// =======================================================================================
/*
- 매핑 방식: PUT
- 요청 URL: /api/admin/developer/update
- 요청 데이터: DeveloperDto (FormData → multipart/form-data)
- 요청 헤더: Authorization: Bearer {token}, Content-Type: multipart/form-data
- 응답 데이터: Boolean (true = 성공, false = 실패)
- 설명:
    • 관리자 권한으로 개발자 정보를 수정합니다.
    • 수정 가능한 항목: 이름, 연락처, 주소, 이메일, 레벨, 경험치, 비밀번호, 프로필 이미지 등
    • dfile(MultipartFile)이 존재하면 파일 업로드 수행
    • dno(PK)는 필수이며, 수정일(updateAt)은 서버에서 자동 설정됩니다.
*/
export const updateDeveloper = (token, formData) => {
    return axios.put('/admin/developer/update', formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
        },
    });
};


// =======================================================================================
// ✅ 4. 관리자 기반 개발자 삭제 (상태값 변경 방식)
/*
- 매핑 방식: PUT (논리 삭제 방식)
- 요청 URL: /admin/developer/delete?dno={dno}
- 요청 파라미터: dno (Query Param)
- 요청 헤더: Authorization: Bearer {token}
- 응답 데이터: Boolean (true: 성공, false: 실패)
*/
export const deleteDeveloper = (dno, token) => {
    return axios.put(`/admin/developer/delete?dno=${dno}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
};