/*  AdminController 클래스 | rw 25-04-21 생성
    - 클라이언트의 HTTP 요청을 처리하는 REST 컨트롤러
    - 관리자 회원가입, 로그인, 단건 조회 기능을 담당
    - AdminService 계층에 기능 위임
*/

package devconnect.controller;

// [ * ] 스프링 어노테이션
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

// [ * ] DTO, Service
import devconnect.model.dto.AdminDto;
import devconnect.service.AdminService;

@RestController                           // JSON 응답 전용 컨트롤러
@RequestMapping("/admin")                 // 모든 엔드포인트 앞에 "/admin" prefix
@RequiredArgsConstructor                  // final 필드 생성자 자동 주입
@CrossOrigin("*")                         // 모든 출처 허용 (CORS)
public class AdminController { // CS

    // [ * ] 서비스 의존성 주입
    private final AdminService adminService;

    // [1]. C | rw 25-04-21 생성
    // [1] 관리자 회원가입
    @PostMapping("/signup") // - POST /admin/signup
    public boolean signUp(@RequestBody AdminDto adminDto) { // fs
        return adminService.signUp(adminDto); // 서비스에 회원가입 위임
    } // fe

    // [2]. C | rw 25-04-21 생성
    // [2] 로그인 요청 처리
    @PostMapping("/login") // - POST /admin/login
    public String login(@RequestBody AdminDto adminDto) { // fs
        return adminService.login(adminDto); // ID 반환 또는 실패 처리
    } // fe

    // [3]. R | rw 25-04-21 생성
    // [3] 관리자 단건 정보 조회
    @GetMapping("/info") // - GET /admin/info?adid=admin123
    public AdminDto getInfo(@RequestParam String adid) { // fs
        return adminService.findByAdid(adid); // DTO 반환
    } // fe

} // CE