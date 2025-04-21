package devconnect.controller;


import devconnect.model.dto.CompanyDto;
import devconnect.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CompanyController {

    private final CompanyService companyService;

    // 1. post(회원가입) http://localhost:8080/api/company/signup 확인 완
    @PostMapping("/signup") // {"cid" : "test1" , "cpwd" : "a1234" , "cname" : "test1(주)" , "cphone" : "02-2113-5343" ,"cadress" : "test1" , "cemail" : "test1@naver.com", "cbusiness" :  "214-18-13306" , "cprofile" : "profil1.jpg"}
    public boolean signup(@RequestBody CompanyDto companyDto){
        System.out.println("companyDto = " + companyDto);
        System.out.println("CompanyController.signup");
        boolean result = companyService.signup(companyDto);
        return result;
    }


    // 2. post(login) http://localhost:8080/api/company/login
    @PostMapping("/login") // {"cid" : "test1" , "cpwd" : "a1234"} // 토큰 잘나옴
    public  String login(@RequestBody CompanyDto companyDto){
        System.out.println("companyDto = " + companyDto);
        System.out.println("CompanyController.login");
        String result = companyService.login(companyDto);
        return result;
    }


    // 2. post(logout) http://localhost:8080/api/company/logout
    @GetMapping("/logout")
    public void logout(@RequestHeader("Authorization") String token){
       companyService.logout(token);
    }


    // 3. 기업정보 findall
    public List<CompanyDto>



    // 4. 기업 개별정보



    // 5. 기업 수정 update(상태) 012






}
