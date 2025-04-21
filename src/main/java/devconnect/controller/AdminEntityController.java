/*
 * AdminEntityController 클래스 | rw 25-04-19 생성
 * - 클라이언트의 HTTP 요청을 처리하는 REST 컨트롤러
 * - 관리자 회원가입, 로그인, 단건 조회 기능 담당
 * - 서비스 계층과 연결하여 로직 위임
*/

package devconnect.controller;

// [*] 스프링 어노테이션
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

// [*] 서비스, DTO
import devconnect.model.dto.AdminDto;
import devconnect.service.AdminEntityService;

@RestController                           // [*] JSON 응답 전용 컨트롤러
@RequestMapping("/admin")                 // [*] 모든 엔드포인트 앞에 "/admin" prefix
@RequiredArgsConstructor                  // [*] final 필드 생성자 자동 주입
@CrossOrigin("*")                         // [*] CORS 허용 (모든 도메인 접근 허용)
public class AdminEntityController { // CS

    // [*] 서비스 주입
    private final AdminEntityService adminService;

    // [1] 회원가입 엔드포인트
    @PostMapping("/signup") // - POST /admin/signup
    public boolean signUp(@RequestBody AdminDto adminDto) { // fs
        return adminService.signUp(adminDto);               // [*] 서비스에 회원가입 위임
    } // fe

    // [2] 로그인 엔드포인트
    @PostMapping("/login") // - POST /admin/login
    public String login(@RequestBody AdminDto adminDto) { // fs
        return adminService.login(adminDto);              // [*] 로그인 성공 시 ID 반환 (임시)
    } // fe

    // [3] 단건 조회 엔드포인트
    @GetMapping("/info") // - GET /admin/info?adid=admin123
    public AdminDto getInfo(@RequestParam String adid) { // fs
        return adminService.findByAdid(adid);            // [*] 서비스에서 조회한 DTO 반환
    } // fe

} // CE