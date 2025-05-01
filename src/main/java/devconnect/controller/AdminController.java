/*  AdminController 클래스 | rw 25-04-27 리팩토링
    - 클라이언트의 HTTP 요청을 처리하는 REST 컨트롤러입니다.
    - 관리자 회원가입, 로그인, 개별 조회, 전체 조회, 수정, 삭제, 로그아웃 기능을 담당합니다.
    - AdminService 계층에 기능을 위임합니다.
*/

package devconnect.controller;

// [*] 스프링 관련 어노테이션
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

// [*] DTO, Service import
import devconnect.model.dto.AdminDto;
import devconnect.service.AdminService;
import devconnect.model.dto.AdminLoginDto;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController // [A] REST API 컨트롤러 지정
@RequestMapping("api/admin") // [B] 컨트롤러 기본 URL 매핑
@RequiredArgsConstructor // [C] 생성자 기반 의존성 주입
@CrossOrigin("*") // [D] 모든 출처 허용 (CORS)
public class AdminController { // CS

    // [*] AdminService 의존성 주입
    private final AdminService adminService;

    // =======================================================================================
    // [*] Bearer 제거 메서드
    private String extractToken(String bearerToken) { // fs
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    } // fe

    // =======================================================================================
    /*
        매핑 방식: POST, 요청 URL: /api/admin/signup
        매개변수: AdminDto (RequestBody)
        응답 데이터 타입: Boolean
    */
    @PostMapping("/signup")
    public ResponseEntity<?> adminSignUp(@Valid @RequestBody AdminDto dto) { // fs
        boolean result = adminService.adminSignUp(dto);

        if (result) {
            return ResponseEntity.status(201).body(true); // 201 Created
        } else {
            return ResponseEntity.status(400).body(errorResponse(400, "회원가입에 실패했습니다."));
        }
    } // fe

    // =======================================================================================
    /*
        매핑 방식: POST, 요청 URL: /api/admin/login
        매개변수: AdminLoginDto (RequestBody)
        응답 데이터 타입: String (JWT 토큰)
    */
    @PostMapping("/login")
    public ResponseEntity<?> adminLogIn(@Valid @RequestBody AdminLoginDto loginDto) {


        // (1) 로그: 전달된 ID/PW 확인
        System.out.println("입력된 adid: " + loginDto.getAdid());
        System.out.println("입력된 adpwd: " + loginDto.getAdpwd());

        // (2) 실제 로그인 처리
        String token = adminService.adminLogIn(loginDto.getAdid(), loginDto.getAdpwd());

        // (3) 응답 처리
        if (token != null) {
            return ResponseEntity.status(200).body(token); // 200 OK
        } else {
            return ResponseEntity.status(401).body(errorResponse(401, "로그인 실패: 아이디 또는 비밀번호를 확인하세요."));
        }
    }


    // =======================================================================================
    /*
        매핑 방식: GET, 요청 URL: /api/admin/info
        매개변수: Authorization 토큰 (RequestHeader)
        응답 데이터 타입: AdminDto
    */
    @GetMapping("/info")
    public ResponseEntity<?> adminFindById(@RequestHeader("Authorization") String token) { // fs
        String pureToken = extractToken(token);

        AdminDto adminDto = adminService.adminFindById(pureToken);

        if (adminDto != null) {
            return ResponseEntity.status(200).body(adminDto); // 200 OK
        } else {
            return ResponseEntity.status(403).body(errorResponse(403, "인증 실패 또는 회원 정보 조회 실패"));
        }
    } // fe

    // =======================================================================================
    /*
        매핑 방식: GET, 요청 URL: /api/admin/allinfo
        매개변수: 없음
        응답 데이터 타입: List<AdminDto>
    */
    @GetMapping("/allinfo")
    public ResponseEntity<?> adminFindAll() { // fs
        List<AdminDto> adminDtoList = adminService.adminFindAll();

        if (adminDtoList != null && !adminDtoList.isEmpty()) {
            return ResponseEntity.status(200).body(adminDtoList); // 200 OK
        } else {
            return ResponseEntity.status(204).build(); // 204 No Content
        }
    } // fe

    // =======================================================================================
    /*
        매핑 방식: PUT, 요청 URL: /api/admin/update
        매개변수: Authorization 토큰 (RequestHeader), AdminDto (ModelAttribute)
        응답 데이터 타입: Boolean
    */
    @PutMapping("/update")
    public ResponseEntity<?> adminUpdate(@RequestHeader("Authorization") String token,
                                         @ModelAttribute AdminDto adminDto) { // fs

        String pureToken = extractToken(token);

        String adminLoginAdid;
        try {
            adminLoginAdid = adminService.adminFindById(pureToken).getAdid();
        } catch (Exception e) {
            return ResponseEntity.status(401).body(errorResponse(401, "수정 권한이 없습니다."));
        }

        boolean result = adminService.adminUpdate(adminDto, adminLoginAdid);
        if (!result) {
            return ResponseEntity.status(400).body(errorResponse(400, "회원 정보 수정 실패"));
        }

        return ResponseEntity.status(200).body(true);
    } // fe

    // =======================================================================================
    /*
        매핑 방식: PUT, 요청 URL: /api/admin/delete
        매개변수: 관리자 ID (RequestParam)
        응답 데이터 타입: Boolean
    */
    @PutMapping("/delete")
    public ResponseEntity<?> adminDelete(@RequestParam String adid) { // fs
        boolean result = adminService.adminDelete(adid);

        if (result) {
            return ResponseEntity.status(200).body(true); // 200 OK
        } else {
            return ResponseEntity.status(400).body(errorResponse(400, "관리자 삭제 실패"));
        }
    } // fe

    // =======================================================================================
    /*
        매핑 방식: GET, 요청 URL: /api/admin/logout
        매개변수: Authorization 토큰 (RequestHeader)
        응답 데이터 타입: 없음 (204 No Content)
    */
    @GetMapping("/logout")
    public ResponseEntity<?> adminLogout(@RequestHeader("Authorization") String token) { // fs
        String pureToken = extractToken(token);

        adminService.adminLogout(pureToken);
        return ResponseEntity.status(204).build(); // 204 No Content
    } // fe

    // =======================================================================================
    // [*] 실패 시 공통 에러 응답 메서드
    private Map<String, Object> errorResponse(int status, String message) { // fs
        Map<String, Object> errorMap = new HashMap<>();
        errorMap.put("status", status);
        errorMap.put("message", message);
        return errorMap;
    } // fe

    // =======================================================================================
    /*
        매핑 방식: GET, 요청 URL: /api/admin/stats
        설명: 관리자용 전체 통계 카드 정보 반환
        응답 데이터: Map<String, Object>
     */
    @GetMapping("/stats")
    public ResponseEntity<?> getDashboardStats() { // fs
        Map<String, Object> stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    } // fe

    // =======================================================================================
    /*
        매핑 방식: GET, 요청 URL: /api/admin/recent-approved
        설명: 최근 승인된 기업, 개발자, 프로젝트 리스트 반환 (5개씩)
        응답 데이터: Map<String, Object>
     */
    @GetMapping("/recent-approved")
    public ResponseEntity<?> getRecentApprovedList() { // fs
        Map<String, Object> result = adminService.getRecentApprovedList();
        return ResponseEntity.ok(result);
    } // fe

    // =======================================================================================
    /*
        매핑 방식: GET, 요청 URL: /api/admin/monthly-join
        설명: 월별 프로젝트 참여 수 통계 (LineChart용)
        응답 데이터: List<Map<String, Object>>
     */
    @GetMapping("/monthly-join")
    public ResponseEntity<?> getMonthlyJoinStats() { // fs
        return ResponseEntity.ok(adminService.getMonthlyJoinStats());
    } // fe

} // CE