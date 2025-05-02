// developerApi.js | rw 25-05-02 최종 리팩토링
// [설명] 관리자(Admin) 전용 개발자(Developer) API 요청 함수 모음
//        - 모든 요청은 axiosInstance 기반으로 통신됨

import axios from './axiosInstance'; // ✅ 공통 Axios 인스턴스 import

// =======================================================================================
// ✅ 1. 전체 개발자 목록 조회
/*
    매핑 방식: GET
    요청 URL: /api/developer/findall
    요청 파라미터: 없음
    응답 데이터: List<DeveloperDto>
*/
export const getDeveloperList = () => {
    return axios.get('/api/developer/findall');
};

// =======================================================================================
// ✅ 2. 개발자 상세 조회
/*
    매핑 방식: GET
    요청 URL: /api/developer/detail?dno={dno}
    요청 파라미터: dno (개발자 고유 번호)
    응답 데이터: DeveloperDto
*/
export const getDeveloperDetail = (dno) => {
    return axios.get(`/api/developer/detail?dno=${dno}`);
};

// =======================================================================================
// ✅ 3. 개발자 정보 수정
/*
    매핑 방식: PUT
    요청 URL: /api/developer
    요청 데이터: DeveloperDto (RequestBody)
    요청 헤더: Authorization: Bearer {token}, Content-Type: application/json
    응답 데이터: Boolean
*/
export const updateDeveloper = (token, developerDto) => {
    return axios.put('/api/developer', developerDto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 4. 개발자 상태코드 수정
/*
    매핑 방식: PUT
    요청 URL: /api/developer/state
    요청 데이터: DeveloperDto (dno, dstate 포함)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: Boolean
*/
export const updateDeveloperState = (token, dto) => {
    return axios.put('/api/developer/state', dto, {
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });
};

// =======================================================================================
// ✅ 5. 개발자 삭제 요청
/*
    매핑 방식: DELETE
    요청 URL: /api/developer?dno={dno}
    요청 파라미터: dno (개발자 고유 번호)
    요청 헤더: Authorization: Bearer {token}
    응답 데이터: Boolean
*/
export const deleteDeveloper = (dno, token) => {
    return axios.delete(`/api/developer?dno=${dno}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
