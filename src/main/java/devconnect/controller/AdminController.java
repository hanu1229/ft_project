/*  AdminController 클래스 | rw 25-05-02 최종 리팩토링
    - 클라이언트의 HTTP 요청을 처리하는 REST 컨트롤러입니다.
    - 관리자 회원가입, 로그인, 개별 조회, 전체 조회, 수정, 삭제, 로그아웃 기능을 담당합니다.
    - 대시보드용 통계, 최근 승인, 월별 참여, 실시간 접속자 수 조회 기능 포함
*/

package devconnect.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import devconnect.model.dto.AdminDto;
import devconnect.model.dto.AdminLoginDto;
import devconnect.service.AdminService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController                                // [A] REST 컨트롤러로 JSON 응답 전용 처리
@RequestMapping("api/admin")                    // [B] 공통 URL prefix 적용
@RequiredArgsConstructor                         // [C] 생성자 자동 주입
@CrossOrigin("*")                              // [D] 모든 출처 허용
public class AdminController { // CS

    private final AdminService adminService; // [*] 서비스 계층 주입

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
    // [X] 공통 오류 응답 메서드
    private Map<String, Object> errorResponse(int status, String message) {
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("status", status);
        errorMap.put("message", message);
        return errorMap;
    }

} // CE