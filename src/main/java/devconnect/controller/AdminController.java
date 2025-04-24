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

import java.util.List;

@RestController                                 // JSON 응답 전용 컨트롤러
@RequestMapping("api/admin")                 // 모든 엔드포인트 앞에 "api/admin" prefix
@RequiredArgsConstructor                       // final 필드 생성자 자동 주입
@CrossOrigin("*")                              // 모든 출처 허용 (CORS)
public class AdminController { // CS

    // [ * ] 서비스 의존성 주입
    private final AdminService adminService;

    // [1]. C | rw 25-04-23 생성
    // [1] 관리자 회원가입
    @PostMapping("/signup") // - POST api/admin/signup
    public boolean signUp(@RequestBody AdminDto adminDto) { // fs
        return adminService.signUp(adminDto); // 회원가입 처리
    } // fe

    // [2]. C | rw 25-04-23 생성
    // [2] 관리자 로그인
    @PostMapping("/login") // - POST api/admin/login
    public String login(@RequestBody AdminDto adminDto) { // fs
        return adminService.login(adminDto); // 로그인 처리
    } // fe

    // [3]. R | rw 25-04-23 생성
    // [3] 관리자 단건 정보 조회
    @GetMapping("/info") // - GET api/admin/info?adid=admin01
    public AdminDto findById(@RequestParam String adid) { // fs
        return adminService.findByInfo(adid); // ID로 조회
    } // fe

    // [4]. R | rw 25-04-23 생성
    // [4] 관리자 전체 조회
    @GetMapping("/allinfo") // - GET api/admin/allinfo
    public List<AdminDto> findAll() { // fs
        return adminService.findAll(); // 전체 목록 반환
    } // fe

    // [5]. U | rw 25-04-23 생성
    // [5] 관리자 정보 수정
    @PutMapping("/update") // - PUT api/admin/update
    public boolean update(@RequestBody AdminDto adminDto) { // fs
        return adminService.update(adminDto); // 수정 처리
    } // fe

    // [6]. D | rw 25-04-23 생성
    // [6] 관리자 삭제 요청 (실제 삭제 아님 - 상태 업데이트)
    @PutMapping("/delete") // - PUT api/admin/delete?adid=admin01
    public boolean delete(@RequestParam String adid) { // fs
        return adminService.delete(adid); // 삭제(상태값 변경) 처리
    } // fe

} // CE