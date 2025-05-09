/*  AdminController 클래스 | rw 25-05-03 리팩토링 (주석 보완)
    - 클라이언트의 HTTP 요청을 처리하는 REST 컨트롤러입니다.
    - 관리자 회원가입, 로그인, 개별 조회, 전체 조회, 수정, 삭제, 로그아웃 기능을 담당합니다.
    - 대시보드용 통계, 최근 승인, 월별 참여, 실시간 접속자 수 조회 기능 포함
*/

package devconnect.controller;

// [A] 스프링 Web 관련 어노테이션
import devconnect.model.dto.CompanyDto;
import devconnect.service.CompanyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// [B] Lombok 어노테이션
import lombok.RequiredArgsConstructor;

// [C] 유효성 검사용 어노테이션
import jakarta.validation.Valid;

// [D] 내부 모듈 import
import devconnect.model.dto.AdminDto;
import devconnect.model.dto.AdminLoginDto;
import devconnect.service.AdminService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController                                // [A-1] REST API 전용 컨트롤러
@RequestMapping("api/admin")                    // [A-2] 공통 URL prefix 적용
@RequiredArgsConstructor                         // [B-1] 생성자 주입 방식 적용
@CrossOrigin("*")                              // [A-3] 모든 Origin 허용
public class AdminController { // CS

    private final AdminService adminService; // [*] 서비스 계층 주입
    private final CompanyService companyService; // [*] 서비스 계층 주입

    // =======================================================================================
    // [*] Bearer 토큰 제거 메서드
    private String extractToken(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    }

    // =======================================================================================
    // ✅ 1. 관리자 회원가입
    /*
        - 매핑 방식: POST
        - 요청 URL: /api/admin/signup
        - 요청 데이터: AdminDto (RequestBody)
        - 응답 데이터: Boolean
    */
    @PostMapping("/signup")
    public ResponseEntity<?> adminSignUp(@Valid @RequestBody AdminDto dto) {
        boolean result = adminService.adminSignUp(dto);
        return result ? ResponseEntity.status(201).body(true)
                : ResponseEntity.status(400).body(errorResponse(400, "회원가입에 실패했습니다."));
    }

    // =======================================================================================
    // ✅ 2. 관리자 로그인
    /*
        - 매핑 방식: POST
        - 요청 URL: /api/admin/login
        - 요청 데이터: AdminLoginDto (RequestBody)
        - 응답 데이터: String (JWT 토큰)
    */
    @PostMapping("/login")
    public ResponseEntity<?> adminLogIn(@Valid @RequestBody AdminLoginDto loginDto) {
        String token = adminService.adminLogIn(loginDto.getAdid(), loginDto.getAdpwd());
        return token != null ? ResponseEntity.ok(token)
                : ResponseEntity.status(401).body(errorResponse(401, "로그인 실패: 아이디 또는 비밀번호를 확인하세요."));
    }

    // =======================================================================================
    // ✅ 3. 관리자 본인 정보 조회
    /*
        - 매핑 방식: GET
        - 요청 URL: /api/admin/info
        - 요청 헤더: Authorization: Bearer {token}
        - 응답 데이터: AdminDto
    */
    @GetMapping("/info")
    public ResponseEntity<?> adminFindById(@RequestHeader("Authorization") String token) {
        AdminDto adminDto = adminService.adminFindById(extractToken(token));
        return adminDto != null ? ResponseEntity.ok(adminDto)
                : ResponseEntity.status(403).body(errorResponse(403, "인증 실패 또는 회원 정보 조회 실패"));
    }

    // =======================================================================================
    // ✅ 4. 전체 관리자 목록 조회
    /*
        - 매핑 방식: GET
        - 요청 URL: /api/admin/allinfo
        - 응답 데이터: List<AdminDto>
    */
    @GetMapping("/allinfo")
    public ResponseEntity<?> adminFindAll() {
        List<AdminDto> list = adminService.adminFindAll();
        return (list != null && !list.isEmpty()) ? ResponseEntity.ok(list) : ResponseEntity.noContent().build();
    }

    // =======================================================================================
    // ✅ 5. 관리자 정보 수정
    /*
        - 매핑 방식: PUT
        - 요청 URL: /api/admin/update
        - 요청 헤더: Authorization: Bearer {token}
        - 요청 데이터: FormData
        - 응답 데이터: Boolean
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
    // ✅ 6. 관리자 삭제
    /*
        - 매핑 방식: PUT
        - 요청 URL: /api/admin/delete?adid=xxx
        - 요청 파라미터: adid (String)
        - 응답 데이터: Boolean
    */
    @PutMapping("/delete")
    public ResponseEntity<?> adminDelete(@RequestParam String adid) {
        return adminService.adminDelete(adid)
                ? ResponseEntity.ok(true)
                : ResponseEntity.status(400).body(errorResponse(400, "관리자 삭제 실패"));
    }

    // =======================================================================================
    // ✅ 7. 관리자 로그아웃
    /*
        - 매핑 방식: GET
        - 요청 URL: /api/admin/logout
        - 요청 헤더: Authorization: Bearer {token}
        - 응답 데이터: 없음 (204 No Content)
    */
    @GetMapping("/logout")
    public ResponseEntity<?> adminLogout(@RequestHeader("Authorization") String token) {
        adminService.adminLogout(extractToken(token));
        return ResponseEntity.noContent().build();
    }

    // =======================================================================================
    // ✅ 8. 관리자 기반 기업 상세조회
    @GetMapping("/company/detail")
    public ResponseEntity<CompanyDto> getCompanyDetail(@RequestHeader("Authorization") String token , @RequestParam int cno) {
        AdminDto adminDto = adminService.adminFindById(extractToken(token));
        if( adminDto == null ) return ResponseEntity.noContent().build();

        CompanyDto companyDto = adminService.getCompanyDetail( cno );
        return ( companyDto  != null ) ? ResponseEntity.ok( companyDto ) : ResponseEntity.noContent().build();
    }
    // =======================================================================================
    // ✅ 공통 에러 응답 생성기
    private Map<String, Object> errorResponse(int status, String message) {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("status", status);
        errorMap.put("message", message);
        return errorMap;
    }






} // CE