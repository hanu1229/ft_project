package devconnect.controller;

import devconnect.model.dto.DeveloperDto;
import devconnect.service.DeveloperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/developer")
@RequiredArgsConstructor
public class DeveloperController {
    private final DeveloperService developerService;

//    {
//        "did" : "qwe123",
//                "dpwd" : "qwe123",
//                "dname" : "qweqwe",
//                "dphone" : "010-1111-1111",
//                "daddress" : "인천시 미추홀구 도화동",
//                "demail" : "qwe@naver.com"
//    }

    // 1. 개발자 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Boolean> signUp( @RequestBody DeveloperDto developerDto ){
        boolean result = developerService.signUp( developerDto );
        if( result ){ return ResponseEntity.status( 201 ).body( true ); }
        else{ return ResponseEntity.status( 201 ).body( true ); }
    } // f end



    // 2. 개발자 로그인
    @PostMapping("/login")
    public ResponseEntity<String> logIn( @RequestBody DeveloperDto developerDto ){
        String token = developerService.logIn( developerDto );
        if( token != null ){ return ResponseEntity.status( 200 ).body( token ); }
        else{ return ResponseEntity.status( 400 ).body( "로그인 실패" ); }
    } // f end

    // 3. 내 정보 조회
    @GetMapping("/info")
    public ResponseEntity<DeveloperDto> info( @RequestHeader("Authorization") String token ){
        DeveloperDto developerDto = developerService.info( token );
        if( developerDto != null ){ return ResponseEntity.status( 200 ).body( developerDto ); }
        else{ return ResponseEntity.status( 403 ).build(); }
    } // f end

    // 4. 로그아웃
    @GetMapping("/logout")
    public ResponseEntity<DeveloperDto> logout( @RequestHeader("Authorization") String token ){
        developerService.logout( token );
        return ResponseEntity.status( 204 ).build();
    } // f end

    // 5. 개발자 정보 수정
    @PutMapping("/update")
    public ResponseEntity<Boolean> onUpdate( @RequestHeader("Authorization") String token,
                                                  @RequestBody DeveloperDto developerDto ){
        DeveloperDto result = developerService.onUpdate( token, developerDto );
        if( result != null ){ return ResponseEntity.status( 200 ).body( true ); }
        else{ return ResponseEntity.status( 400 ).body( false ); }
    } // f end

    // 6. 개발자 정보 삭제
    @PutMapping("/delete")
    public boolean onDelete( @RequestHeader("Authorization") String token,
                             @RequestBody DeveloperDto developerDto ){
        boolean result = developerService.onDelete( token, developerDto );
        return result;
    } // f end


}

