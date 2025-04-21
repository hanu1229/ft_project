package devconnect.controller;

import devconnect.model.dto.DeveloperDto;
import devconnect.service.DeveloperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/developer")
@RequiredArgsConstructor
public class DeveloperController {
    private final DeveloperService developerService;

    // 1. 개발자 회원가입
    @PostMapping("/signup")
    public ResponseEntity<Boolean> signUp( @RequestBody DeveloperDto developerDto ){
        boolean result = developerService.signUp( developerDto );
        if( result ){ return ResponseEntity.status( 201 ).body( true ); }
        else{ return ResponseEntity.status( 201 ).body( true ); }
    } // f end

    // 2. 개발자 로그인

    // 2.



}
