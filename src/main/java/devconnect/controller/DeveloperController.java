package devconnect.controller;

import devconnect.model.dto.DeveloperDto;
import devconnect.service.DeveloperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/developer")
@RequiredArgsConstructor
public class DeveloperController {
    private final DeveloperService developerService;

    // 1. 개발자 등록
    public ResponseEntity<Boolean> signUp( @RequestBody DeveloperDto developerDto ){
        boolean result = developerService.signUp( developerDto );
        if( result ){ return ResponseEntity.status( 201 ).body( true ); }
        else{ return ResponseEntity.status( 201 ).body( true ); }
    } // f end



}
