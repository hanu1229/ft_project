/*  AdminController 클래스 | rw 25-05-02 최종 리팩토링
    - 클라이언트의 HTTP 요청을 처리하는 REST 컨트롤러입니다.
    - 관리자 회원가입, 로그인, 개별 조회, 전체 조회, 수정, 삭제, 로그아웃 기능을 담당합니다.
    - 대시보드용 통계, 최근 승인, 월별 참여, 실시간 접속자 수 조회 기능 포함
*/

package devconnect.controller;

import devconnect.model.dto.*;
import devconnect.model.dto.developer.DeveloperDto;
import devconnect.model.repository.CratingRepository;
import devconnect.model.repository.DratingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import devconnect.service.AdminService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController                                // [A] REST 컨트롤러로 JSON 응답 전용 처리
@RequestMapping("api/admin")                    // [B] 공통 URL prefix 적용
@RequiredArgsConstructor                         // [C] 생성자 자동 주입
@CrossOrigin("*")                              // [D] 모든 출처 허용
// @CrossOrigin(origins = "http://localhost:5173")  // [E] 정확한 Origin만 허용
public class AdminController { // CS

    private final AdminService adminService; // [*] 서비스 계층 주입
    private final CratingRepository cratingRepository;
    private final DratingRepository dratingRepository;

    // =======================================================================================
    // [*] Bearer 토큰 제거 메서드
    private String extractToken(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    }

    // =======================================================================================
    // [1] 관리자 회원가입
    /*
        매핑 방식: POST
        요청 URL: /api/admin/signup
        설명: 관리자 회원가입 요청 처리
        응답 데이터 타입: Boolean
    */
    @PostMapping("/signup")
    public ResponseEntity<?> adminSignUp(@Valid @RequestBody AdminDto dto) {
        boolean result = adminService.adminSignUp(dto);
        return result ? ResponseEntity.status(201).body(true)
                : ResponseEntity.status(400).body(errorResponse(400, "회원가입에 실패했습니다."));
    }

    // =======================================================================================
    // [2] 관리자 로그인
    /*
        매핑 방식: POST
        요청 URL: /api/admin/login
        설명: 관리자 로그인 요청, JWT 토큰 발급
        응답 데이터 타입: String (JWT 토큰)
    */
    @PostMapping("/login")
    public ResponseEntity<?> adminLogIn(@Valid @RequestBody AdminLoginDto loginDto) {
        String token = adminService.adminLogIn(loginDto.getAdid(), loginDto.getAdpwd());
        return token != null ? ResponseEntity.ok(token)
                : ResponseEntity.status(401).body(errorResponse(401, "로그인 실패: 아이디 또는 비밀번호를 확인하세요."));
    }

    // =======================================================================================
    // [3] 관리자 본인 정보 조회
    /*
        매핑 방식: GET
        요청 URL: /api/admin/info
        설명: 로그인한 관리자 정보 반환 (토큰 기반)
        응답 데이터 타입: AdminDto
    */
    @GetMapping("/info")
    public ResponseEntity<?> adminFindById(@RequestHeader("Authorization") String token) {
        AdminDto adminDto = adminService.adminFindById(extractToken(token));
        return adminDto != null ? ResponseEntity.ok(adminDto)
                : ResponseEntity.status(403).body(errorResponse(403, "인증 실패 또는 회원 정보 조회 실패"));
    }

    // =======================================================================================
    // [4] 전체 관리자 목록 조회
    /*
        매핑 방식: GET
        요청 URL: /api/admin/allinfo
        설명: 모든 관리자 계정 정보 반환
        응답 데이터 타입: List<AdminDto>
    */
    @GetMapping("/allinfo")
    public ResponseEntity<?> adminFindAll() {
        List<AdminDto> list = adminService.adminFindAll();
        return (list != null && !list.isEmpty()) ? ResponseEntity.ok(list) : ResponseEntity.noContent().build();
    }

    // =======================================================================================
    // [5] 관리자 정보 수정
    /*
        매핑 방식: PUT
        요청 URL: /api/admin/update
        설명: 관리자 정보 수정 (이름, 전화번호)
        응답 데이터 타입: Boolean
    */
    @PutMapping("/update")
    public ResponseEntity<?> adminUpdate(@RequestHeader("Authorization") String token,
                                         @ModelAttribute AdminDto adminDto) {
        String adid;
        try {
            adid = adminService.adminFindById(extractToken(token)).getAdid();
        } catch (Exception e) {
            return ResponseEntity.status(401).body(errorResponse(401, "수정 권한이 없습니다."));
        }
        return adminService.adminUpdate(adminDto, adid)
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "회원 정보 수정 실패"));
    }

    // =======================================================================================
    // [6] 관리자 삭제 요청
    /*
        매핑 방식: PUT
        요청 URL: /api/admin/delete
        설명: 관리자 계정 삭제 (adtype 상태 변경)
        응답 데이터 타입: Boolean
    */
    @PutMapping("/delete")
    public ResponseEntity<?> adminDelete(@RequestParam String adid) {
        return adminService.adminDelete(adid)
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "관리자 삭제 실패"));
    }

    // =======================================================================================
    // [7] 관리자 로그아웃
    /*
        매핑 방식: GET
        요청 URL: /api/admin/logout
        설명: 관리자 로그아웃, Redis 토큰 삭제
        응답 데이터 타입: 없음 (204 No Content)
    */
    @GetMapping("/logout")
    public ResponseEntity<?> adminLogout(@RequestHeader("Authorization") String token) {
        adminService.adminLogout(extractToken(token));
        return ResponseEntity.noContent().build();
    }

    // =======================================================================================
    // [8] 대시보드 통계 정보 조회
    /*
        매핑 방식: GET
        요청 URL: /api/admin/stats
        설명: 관리자 대시보드 카드 수치 통계 반환
        응답 데이터 타입: Map<String, Object>
    */
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    // =======================================================================================
    // [9] 최근 승인된 항목 조회
    /*
        매핑 방식: GET
        요청 URL: /api/admin/recent-approved
        설명: 최근 승인된 기업, 개발자, 프로젝트 목록 반환 (5개씩)
        응답 데이터 타입: Map<String, Object>
    */
    @GetMapping("/recent-approved")
    public ResponseEntity<?> getRecentApprovedList() {
        return ResponseEntity.ok(adminService.getRecentApprovedList());
    }

    // =======================================================================================
    // [10] 월별 프로젝트 참여 수 통계
    /*
        매핑 방식: GET
        요청 URL: /api/admin/monthly-join
        설명: 월별 프로젝트 참여 수 (LineChart용)
        응답 데이터 타입: List<Map<String, Object>>
    */
    @GetMapping("/monthly-join")
    public ResponseEntity<?> getMonthlyJoinStats() {
        return ResponseEntity.ok(adminService.getMonthlyJoinStats());
    }

    // =======================================================================================
    // [11] 최근 24시간 로그인 수 전체 조회
    /*
        매핑 방식: GET
        요청 URL: /api/admin/login/count/all
        설명: 최근 24시간 내 관리자, 기업, 개발자 로그인 수 통합 조회
        응답 데이터 타입: Map<String, Integer>
    */
    @GetMapping("/login/count/all")
    public ResponseEntity<?> totalLoginCounts() {
        Map<String, Integer> result = new HashMap<>();
        result.put("admin", adminService.loginCount());
        result.put("company", adminService.companyLoginCount());
        result.put("developer", adminService.developerLoginCount());
        return ResponseEntity.ok(result);
    }


    // =======================================================================================
    // ✅ 1. 관리자 기반 기업 상세조회 API
// =======================================================================================
    /*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/company/detail
    - 설명: 관리자 권한으로 특정 기업(cno)의 상세 정보를 조회합니다.
           Authorization 헤더에 포함된 Bearer 토큰을 통해 관리자 인증을 수행하며,
           해당 토큰이 유효한 관리자일 경우 기업 정보를 반환합니다.
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 파라미터: cno (int) - 조회할 기업 번호
    - 응답 데이터 타입: CompanyDto (200 OK) | null (204 No Content)
    */
    @GetMapping("/company/detail")
    public ResponseEntity<CompanyDto> getCompanyDetail(@RequestHeader("Authorization") String token, @RequestParam int cno) {
        AdminDto adminDto = adminService.adminFindById(extractToken(token));
        if (adminDto == null) return ResponseEntity.noContent().build();

        CompanyDto companyDto = adminService.getCompanyDetail(cno);
        return (companyDto != null) ? ResponseEntity.ok(companyDto) : ResponseEntity.noContent().build();
    }


    // =======================================================================================
    // ✅ 2. 관리자 기반 개발자 상세조회 API (dno 기반)
// =======================================================================================
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/developer/detail
    - 설명: 관리자 권한으로 특정 개발자(dno)의 상세 정보를 조회합니다.
           Authorization 헤더에 포함된 Bearer 토큰을 통해 관리자 인증을 수행하며,
           해당 토큰이 유효한 관리자일 경우 개발자 정보를 반환합니다.
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 파라미터: dno (int) - 조회할 개발자 번호
    - 응답 데이터 타입: DeveloperDto (200 OK) | null (204 No Content)
*/
    @GetMapping("/developer/detail")
    public ResponseEntity<DeveloperDto> getDeveloperDetail(@RequestHeader("Authorization") String token, @RequestParam int dno) {
        AdminDto adminDto = adminService.adminFindById(extractToken(token));
        if (adminDto == null) return ResponseEntity.noContent().build();

        DeveloperDto developerDto = adminService.getDeveloperDetail(dno);
        return (developerDto != null) ? ResponseEntity.ok(developerDto) : ResponseEntity.noContent().build();
    }

    // =======================================================================================
    // ✅ 3. 관리자 기반 기업평가 상세조회 API (crno 기반)
// =======================================================================================
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/crating/detail
    - 설명: 관리자 권한으로 특정 기업평가(crno)의 상세 정보를 조회합니다.
           Authorization 헤더에 포함된 Bearer 토큰을 통해 관리자 인증을 수행하며,
           해당 토큰이 유효한 관리자일 경우 기업평가 정보를 반환합니다.
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 파라미터: crno (int) - 조회할 기업평가 번호
    - 응답 데이터 타입: CratingDto (200 OK) | null (204 No Content)
*/
    @GetMapping("/crating/detail")
    public ResponseEntity<CratingDto> getCratingDetail(@RequestHeader("Authorization") String token, @RequestParam int crno){
        AdminDto adminDto = adminService.adminFindById(extractToken(token));
        if (adminDto == null) return ResponseEntity.noContent().build();

        CratingDto cratingDto = adminService. getCratingDetail(crno);
        return (cratingDto != null) ? ResponseEntity.ok(cratingDto) : ResponseEntity.noContent().build();
    }

// =======================================================================================
    // ✅ 4. 관리자 기반 개발자평가 상세조회 API (drno 기반)
// =======================================================================================
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/drating/detail
    - 설명: 관리자 권한으로 특정 개발자평가(drno)의 상세 정보를 조회합니다.
           Authorization 헤더에 포함된 Bearer 토큰을 통해 관리자 인증을 수행하며,
           해당 토큰이 유효한 관리자일 경우 개발자평가 정보를 반환합니다.
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 파라미터: drno (int) - 조회할 개발자 번호
    - 응답 데이터 타입: DratingDto (200 OK) | null (204 No Content)
*/

    @GetMapping("/drating/detail")
    public ResponseEntity<DratingDto> getDratingDetail(@RequestHeader("Authorization") String token, @RequestParam int drno){
        AdminDto adminDto = adminService.adminFindById(extractToken(token));
        if (adminDto == null) return ResponseEntity.noContent().build();

        DratingDto dratingDto = adminService. getDratingDetail(drno);
        return (dratingDto != null) ? ResponseEntity.ok(dratingDto) : ResponseEntity.noContent().build();
    }


// =======================================================================================
    // ✅ 5. 관리자 기반 프로젝트(기업) 상세조회 API (pno 기반)
// =======================================================================================
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/project/detail
    - 설명: 관리자 권한으로 특정 프로젝트(pno)의 상세 정보를 조회합니다.
           Authorization 헤더에 포함된 Bearer 토큰을 통해 관리자 인증을 수행하며,
           해당 토큰이 유효한 관리자일 경우 프로젝트 정보를 반환합니다.
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 파라미터: pno (int) - 조회할 프로젝트 번호
    - 응답 데이터 타입: ProjectDto (200 OK) | null (204 No Content)
*/

    @GetMapping("/project/detail")
    public ResponseEntity<ProjectDto> getProjectDetail(@RequestHeader("Authorization") String token, @RequestParam int pno){
        AdminDto adminDto = adminService.adminFindById(extractToken(token));
        if (adminDto == null) return ResponseEntity.noContent().build();

        ProjectDto projectDto = adminService. getProjectDetail(pno);
        return (projectDto != null) ? ResponseEntity.ok(projectDto) : ResponseEntity.noContent().build();
    }



    // =======================================================================================
    // ✅ 6. 관리자 기반 프로젝트참여(개발자) 상세조회 API (    기반)
// =======================================================================================
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/project-join/detail
    - 설명: 관리자 권한으로 특정 프로젝트참여(pjno)의 상세 정보를 조회합니다.
           Authorization 헤더에 포함된 Bearer 토큰을 통해 관리자 인증을 수행하며,
           해당 토큰이 유효한 관리자일 경우 프로젝트참여 정보를 반환합니다.
    - 요청 헤더: Authorization: Bearer {token}
    - 요청 파라미터: pjno (int) - 조회할 프로젝트참여 번호
    - 응답 데이터 타입: ProjectJoinDto (200 OK) | null (204 No Content)
*/
    @GetMapping("/project-join/detail")
    public ResponseEntity<ProjectJoinDto> getProjectJoinDetail(@RequestHeader("Authorization") String token, @RequestParam int pjno){
        AdminDto adminDto = adminService.adminFindById(extractToken(token));
        if (adminDto == null) return ResponseEntity.noContent().build();

        ProjectJoinDto projectJoinDto = adminService. getProjectJoinDetail(pjno);
        return (projectJoinDto != null) ? ResponseEntity.ok(projectJoinDto) : ResponseEntity.noContent().build();
    }



    // =======================================================================================
    // ✅ 1. 관리자 기반 프로젝트참여(개발자) 전체조회 API
// =======================================================================================
/*
    - 매핑 방식: GET
    - 요청 URL: /api/admin/project-join/alljoin
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: List<ProjectJoinDto>
*/
    @GetMapping("/project-join/alljoin")
    public ResponseEntity<List<ProjectJoinDto>> getAllProjectJoins(
            @RequestHeader("Authorization") String token
    ) {
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build();

        List<ProjectJoinDto> list = adminService.getAllProjectJoins();
        if (list == null || list.isEmpty()) return ResponseEntity.noContent().build();
        return ResponseEntity.ok(list);
    }
// =======================================================================================
// ✅ 1. 관리자 기반 기업 삭제 API (상태값 변경 방식)
// =======================================================================================
/*
    - 매핑 방식: PUT (물리적 삭제가 아닌 상태 변경 방식)
    - 요청 URL: /api/admin/company/delete
    - 요청 파라미터: cno (Query Param, 기업 식별번호)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @PutMapping("/company/delete") // (1) 상태수정 라서  @PutMapping
    public ResponseEntity<?> companyDelete(
            // 2. 수정할 기업번호  와 관리자토큰 매개변수로 가져오기.
            @RequestParam int cno , @RequestHeader("Authorization") String token ) {
        // 3. 관리자 토큰 확인
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build();
        // 4. 토큰 확인 이후 서비스에게 삭제(상태변경) 요청
        return adminService.companyDelete(cno)
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "기업 삭제 실패"));
    }

    // =======================================================================================
// ✅ 2. 관리자 기반 개발자 삭제 API (상태값 변경 방식)
// =======================================================================================
/*
    - 매핑 방식: PUT (물리적 삭제가 아닌 상태 변경 방식)
    - 요청 URL: /api/admin/developer/delete
    - 요청 파라미터: dno (Query Param, 개발자 식별번호)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @PutMapping("/developer/delete") // ✅ 상태수정 방식이므로 PUT 사용
    public ResponseEntity<?> developerDelete(
            @RequestParam int dno,
            @RequestHeader("Authorization") String token
    ) {
        // 1. 관리자 토큰 검증
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build(); // 인증 실패 시 403

        // 2. 서비스 계층에 삭제(상태변경) 요청
        return adminService.developerDelete(dno)
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "개발자 삭제 실패"));
    }

// =======================================================================================
// ✅ 3. 관리자 기반 기업평가 삭제 API (상태값 변경 방식)
// =======================================================================================
/*
    - 매핑 방식: PUT (물리적 삭제가 아닌 상태 변경 방식)
    - 요청 URL: /api/admin/crating/delete
    - 요청 파라미터: crno (Query Param, 기업평가 식별번호)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @PutMapping("/crating/delete") // ✅ 상태수정 방식이므로 PUT 사용
    public ResponseEntity<?> cratingDelete(
            @RequestParam int crno,
            @RequestHeader("Authorization") String token
    ) {
        // 1. 관리자 토큰 검증
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build(); // 인증 실패 시 403

        // 2. 서비스 계층에 삭제(상태변경) 요청
        return adminService.cratingDelete(crno)
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "기업평가 삭제 실패"));
    }

// =======================================================================================
// ✅ 4. 관리자 기반 개발자평가 삭제 API (상태값 변경 방식)
// =======================================================================================
/*
    - 매핑 방식: PUT (물리적 삭제가 아닌 상태 변경 방식)
    - 요청 URL: /api/admin/drating/delete
    - 요청 파라미터: drno (Query Param, 개발자평가 식별번호)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @PutMapping("/drating/delete") // ✅ 상태수정 방식이므로 PUT 사용
    public ResponseEntity<?> dratingDelete(
            @RequestParam int drno,
            @RequestHeader("Authorization") String token
    ) {
        // 1. 관리자 토큰 검증
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build(); // 인증 실패 시 403

        // 2. 서비스 계층에 삭제(상태변경) 요청
        return adminService.dratingDelete(drno)
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "개발자평가 삭제 실패"));
    }

// =======================================================================================
// ✅ 5. 관리자 기반 프로젝트 삭제 API (물리적 삭제 방식)
// =======================================================================================
/*
    - 매핑 방식: DELETE (실제 DB에서 프로젝트 데이터를 제거)
    - 요청 URL: /api/admin/project/delete
    - 요청 파라미터: pno (Query Param, 프로젝트 식별번호)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @DeleteMapping("/project/delete") // ✅ 실제 삭제 → HTTP DELETE 사용
    public ResponseEntity<?> projectDelete(
            @RequestParam int pno,
            @RequestHeader("Authorization") String token
    ) {
        // 1. 관리자 토큰 검증
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build(); // 인증 실패 시 403 반환

        // 2. 서비스 계층에 실제 삭제 요청
        return adminService.deleteProjectPhysically(pno)
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "프로젝트 삭제 실패"));
    }

// =======================================================================================
// ✅ 6. 관리자 기반 프로젝트참여 삭제 API (물리적 삭제 방식)
// =======================================================================================
/*
    - 매핑 방식: DELETE (실제 DB에서 프로젝트참여 데이터를 제거)
    - 요청 URL: /api/admin/project-join/delete
    - 요청 파라미터: pjno (Query Param, 프로젝트참여 식별번호)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @DeleteMapping("/project-join/delete") // ✅ 실제 삭제 → HTTP DELETE 사용
    public ResponseEntity<?> projectJoinDelete(
            @RequestParam int pjno,
            @RequestHeader("Authorization") String token
    ) {
        // 1. 관리자 토큰 검증
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build(); // 인증 실패 시 403

        // 2. 서비스 계층에 실제 삭제 요청
        return adminService.deleteProjectJoinPhysically(pjno)
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "프로젝트참여 삭제 실패"));
    }

// =======================================================================================
// ✅ 1. 관리자 기반 기업 수정 API (@ModelAttribute 방식)
// =======================================================================================
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/admin/company/update
    - 요청 데이터: CompanyDto (FormData → @ModelAttribute)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @PutMapping("/company/update")
    public ResponseEntity<?> updateCompany(
            @ModelAttribute CompanyDto dto,
            @RequestHeader("Authorization") String token
    ) {
        // 1. 관리자 인증
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build();

        // 2. 서비스 호출 (수정 로직 포함)
        boolean result = adminService.updateCompany(dto);

        return result
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "기업 정보 수정 실패"));
    }

// =======================================================================================
// ✅ 2. 관리자 기반 개발자 수정 API (@ModelAttribute 방식)
// =======================================================================================
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/admin/developer/update
    - 요청 데이터: DeveloperDto (FormData → @ModelAttribute)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @PutMapping("/developer/update")
    public ResponseEntity<?> updateDeveloper(
            @ModelAttribute DeveloperDto dto,
            @RequestHeader("Authorization") String token
    ) {
        // 1. 관리자 인증
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build();

        // 2. 서비스 호출
        boolean result = adminService.updateDeveloper(dto);

        return result
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "개발자 정보 수정 실패"));
    }

// =======================================================================================
// ✅ 3. 관리자 기반 기업평가 수정 API (@RequestBody 방식)
// =======================================================================================
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/admin/crating/update
    - 요청 데이터: CratingDto (JSON → @RequestBody)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @PutMapping("/crating/update")
    public ResponseEntity<?> updateCrating(
            @RequestBody CratingDto dto,
            @RequestHeader("Authorization") String token
    ) {
        // 1. 관리자 인증
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build();

        // 2. 수정 요청
        boolean result = adminService.updateCrating(dto);

        return result
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "기업평가 수정 실패"));
    }


// =======================================================================================
// ✅ 4. 관리자 기반 개발자평가 수정 API (@RequestBody 방식)
// =======================================================================================
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/admin/drating/update
    - 요청 데이터: DratingDto (JSON → @RequestBody)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @PutMapping("/drating/update")
    public ResponseEntity<?> updateDrating(
            @RequestBody DratingDto dto,
            @RequestHeader("Authorization") String token
    ) {
        // 1. 관리자 인증
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build();

        // 2. 서비스 호출
        boolean result = adminService.updateDrating(dto);

        return result
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "개발자평가 수정 실패"));
    }

// =======================================================================================
// ✅ 5. 관리자 기반 프로젝트 수정 API (@ModelAttribute 방식)
// =======================================================================================
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/admin/project/update
    - 요청 데이터: ProjectDto (FormData → @ModelAttribute)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @PutMapping("/project/update")
    public ResponseEntity<?> updateProject(
            @ModelAttribute ProjectDto dto,
            @RequestHeader("Authorization") String token
    ) {
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build();

        boolean result = adminService.updateProject(dto);
        return result
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "프로젝트 수정 실패"));
    }

// =======================================================================================
// ✅ 6. 관리자 기반 프로젝트참여 수정 API (@RequestBody 방식)
// =======================================================================================
/*
    - 매핑 방식: PUT
    - 요청 URL: /api/admin/project-join/update
    - 요청 데이터: ProjectJoinDto (JSON → @RequestBody)
    - 요청 헤더: Authorization: Bearer {token}
    - 응답 데이터: Boolean (true: 성공, false: 실패)
*/

    @PutMapping("/project-join/update")
    public ResponseEntity<?> updateProjectJoin(
            @RequestBody ProjectJoinDto dto,
            @RequestHeader("Authorization") String token
    ) {
        AdminDto admin = adminService.adminFindById(extractToken(token));
        if (admin == null) return ResponseEntity.status(403).build();

        boolean result = adminService.updateProjectJoin(dto);
        return result
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "프로젝트 참여정보 수정 실패"));
    }

    // =======================================================================================
    // [X] 공통 오류 응답 메서드
    private Map<String, Object> errorResponse(int status, String message) {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("status", status);
        errorMap.put("message", message);
        return errorMap;
    }





} // CE