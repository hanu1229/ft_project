/*  AdminController 클래스 | rw 25-04-21 생성
    - 클라이언트의 HTTP 요청을 처리하는 REST 컨트롤러입니다.
    - 관리자 회원가입, 로그인, 단건 조회, 전체 조회, 수정, 삭제, 로그아웃 기능을 담당합니다.
    - AdminService 계층에 기능을 위임합니다.
*/

package devconnect.controller;

// [*] 스프링 관련 어노테이션
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// [*] DTO, Service import
import devconnect.model.dto.AdminDto;
import devconnect.service.AdminService;

import java.util.List;


@RestController // [A] REST API 컨트롤러 지정


@RequestMapping("api/admin") // [B] 컨트롤러 기본 URL 매핑


@RequiredArgsConstructor // [C] 생성자 기반 의존성 주입


@CrossOrigin("*") // [D] 모든 출처 허용 (CORS)
public class AdminController { // CS

    // [*] AdminService 의존성 주입
    private final AdminService adminService;

    // =======================================================================================
    // [1] 관리자 회원가입 기능
    /*
        매핑 방식: POST, 요청 URL: /api/admin/signup
        매개변수: AdminDto (RequestBody)
        응답 데이터 타입: Boolean
    */
    @PostMapping("/signup")
    public ResponseEntity<Boolean> adminSignUp(@RequestBody AdminDto dto) { // fs
        boolean result = adminService.adminSignUp(dto);

        if (result) {
            return ResponseEntity.status(201).body(true); // 201 Created
        } else {
            return ResponseEntity.status(400).body(false); // 400 Bad Request
        }
    } // fe

    // =======================================================================================
    // [2] 관리자 로그인 기능
    /*
        매핑 방식: POST, 요청 URL: /api/admin/login
        매개변수: AdminDto (RequestBody)
        응답 데이터 타입: String (JWT 토큰)
    */
    @PostMapping("/login")
    public ResponseEntity<String> adminLogIn(@RequestBody AdminDto adminDto) { // fs
        String token = adminService.adminLogIn(adminDto);

        if (token != null) {
            return ResponseEntity.status(200).body(token); // 200 OK
        } else {
            return ResponseEntity.status(401).body("로그인 실패"); // 401 Unauthorized
        }
    } // fe

    // =======================================================================================
    // [3] 관리자 단건 조회 기능
    /*
        매핑 방식: GET, 요청 URL: /api/admin/info
        매개변수: Authorization 토큰 (RequestHeader)
        응답 데이터 타입: AdminDto
    */
    @GetMapping("/info")
    public ResponseEntity<AdminDto> adminFindById(@RequestHeader("Authorization") String token) { // fs
        AdminDto adminDto = adminService.adminFindById(token);

        if (adminDto != null) {
            return ResponseEntity.status(200).body(adminDto); // 200 OK
        } else {
            return ResponseEntity.status(403).build(); // 403 Forbidden
        }
    } // fe

    // =======================================================================================
    // [4] 관리자 전체 조회 기능
    /*
        매핑 방식: GET, 요청 URL: /api/admin/allinfo
        매개변수: 없음
        응답 데이터 타입: List<AdminDto>
    */
    @GetMapping("/allinfo")
    public ResponseEntity<List<AdminDto>> adminFindAll() { // fs
        List<AdminDto> adminDtoList = adminService.adminFindAll();

        if (adminDtoList != null && !adminDtoList.isEmpty()) {
            return ResponseEntity.status(200).body(adminDtoList); // 200 OK
        } else {
            return ResponseEntity.status(204).build(); // 204 No Content
        }
    } // fe

    // =======================================================================================
    // [5] 관리자 정보 수정 기능
    /*
        매핑 방식: PUT, 요청 URL: /api/admin/update
        매개변수: Authorization 토큰, AdminDto (ModelAttribute)
        응답 데이터 타입: Boolean
    */
    @PutMapping("/update")
    public ResponseEntity<Boolean> adminUpdate(
            @RequestHeader("Authorization") String token,
            @ModelAttribute AdminDto adminDto) { // fs

        String adminLoginAdid;
        try {
            adminLoginAdid = adminService.adminFindById(token).getAdid(); // (1) 토큰에서 관리자 ID 추출
        } catch (Exception e) {
            return ResponseEntity.status(401).body(false); // (2) 인증 실패 시 401
        }

        boolean result = adminService.adminUpdate(adminDto, adminLoginAdid); // (3) 정보 수정 시도
        if (!result) return ResponseEntity.status(400).body(false); // (4) 수정 실패 시 400

        return ResponseEntity.status(200).body(true); // (5) 수정 성공 시 200
    } // fe

    // =======================================================================================
    // [6] 관리자 삭제 요청 기능 (상태 업데이트 방식)
    /*
        매핑 방식: PUT, 요청 URL: /api/admin/delete
        매개변수: 관리자 ID (RequestParam)
        응답 데이터 타입: Boolean
    */
    @PutMapping("/delete")
    public ResponseEntity<Boolean> adminDelete(@RequestParam String adid) { // fs
        boolean result = adminService.adminDelete(adid);

        if (result) {
            return ResponseEntity.status(200).body(true); // 200 OK
        } else {
            return ResponseEntity.status(400).body(false); // 400 Bad Request
        }
    } // fe

    // =======================================================================================
    // [7] 관리자 로그아웃 기능
    /*
        매핑 방식: GET, 요청 URL: /api/admin/logout
        매개변수: Authorization 토큰 (RequestHeader)
        응답 데이터 타입: 없음 (204 No Content)
    */
    @GetMapping("/logout")
    public ResponseEntity<Void> adminLogout(@RequestHeader("Authorization") String token) { // fs
        adminService.adminLogout(token);
        return ResponseEntity.status(204).build(); // 204 No Content
    } // fe

} // CE