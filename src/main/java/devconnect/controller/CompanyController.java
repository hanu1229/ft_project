package devconnect.controller;


import devconnect.model.dto.CompanyDto;
import devconnect.service.CompanyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/company")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CompanyController {

    private final CompanyService companyService;

    // 1. post(회원가입) http://localhost:8080 확인 완
    @PostMapping("/signup") // {"cid" : "test1" , "cpwd" : "1234" , "cname" : "test1(주)" , "cphone" : "02-2113-5343" ,"cadress" : "test1" , "cemail" : "test1@naver.com", "cbusiness" :  "214-18-13306" , "cprofile" : "profil1.jpg"}
    public ResponseEntity<Boolean> signup(@ModelAttribute CompanyDto companyDto){
        System.out.println("companyDto = " + companyDto);
        System.out.println("CompanyController.signup");
        boolean result = companyService.signup(companyDto);
        if (result){
            return ResponseEntity.status(201).body(true);
        }else {
            return ResponseEntity.status(400).body(false);
        }

    }


    // 2. post(login) http://localhost:8080/api/company/login
    @PostMapping("/login") // {"cid" : "cmd1" , "cpwd" : "1234"} // 토큰 잘나옴
    public  ResponseEntity<String> login(@RequestBody CompanyDto companyDto){
        System.out.println("companyDto = " + companyDto);
        System.out.println("CompanyController.login");
        String token = companyService.login(companyDto);
        if (token != null){
                return ResponseEntity.status(200).body(token);
        }else {
            return ResponseEntity.status(401).body("로그인 실패");
        }
    }


    // 3. post(logout) http://localhost:8080/api/company/logout
    @GetMapping("/logout")
    public void logout(@RequestHeader("Authorization") String token){
       companyService.logout(token);
    }

    // 4. 내정보(개별정보) 조회
    @GetMapping("/info")
    public ResponseEntity<CompanyDto> info(@RequestHeader("Authorization") String token){
        CompanyDto companyDto = companyService.info(token);
        if (companyDto != null){
            return ResponseEntity.status(200).body(companyDto);
        }else {
            return ResponseEntity.status(403).body(null);
        }
    }


    // 5. 기업정보 findall http://localhost:8080/api/company/findall
    @GetMapping("/findall")
    public ResponseEntity<List<CompanyDto>> findAll(){
        List<CompanyDto> result = companyService.findAll();
      if (result != null){
          return ResponseEntity.status(201).body(result);
      }else {
          return ResponseEntity.status(400).body(null);
      }
    }




     //6. 기업 수정 update(상태) 012
    @PutMapping("/state")
    public ResponseEntity<Boolean> stateCompany(@RequestHeader("Authorization") String token , @RequestBody CompanyDto companyDto ){

        boolean result = companyService.stateCompany(token, companyDto.getCno() , companyDto.getState() );
        if (result == false) ResponseEntity.status(400).body(false);
        return ResponseEntity.status(200).body(true);
    }





}
