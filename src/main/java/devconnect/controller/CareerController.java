package devconnect.controller;

import devconnect.model.dto.CareerDto;
import devconnect.service.CareerService;
import devconnect.service.DeveloperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/career")
@RequiredArgsConstructor
@CrossOrigin("*")
public class CareerController {
    private final CareerService careerService;
    private final DeveloperService developerService;

    // 1. 경력 등록
    @PostMapping
    public ResponseEntity< Boolean > onWrite(
            @RequestHeader("Authorization") String token,
            @RequestBody CareerDto careerDto ){
        int logInDno = 0;
        try{ logInDno = developerService.info( token ).getDno();
        }catch ( Exception e ){ return ResponseEntity.status( 401 ).body( false ); }

        boolean result = careerService.onWrite( careerDto, logInDno );
        if( !result ){ return ResponseEntity.status( 400 ).body( false ); }
        return ResponseEntity.status( 201 ).body( true );
    } // f end

    // 2. 경력 조회
    @GetMapping("/findall")
    public ResponseEntity< List<CareerDto> > findByDno(
            @RequestHeader("Authorization") String token ){
        int logInDno = 0;
        try{ logInDno = developerService.info( token ).getDno();
        }catch ( Exception e ){ return ResponseEntity.status( 401 ).body( null ); }

        List<CareerDto> result = careerService.findByDno( logInDno );
        return ResponseEntity.status( 200 ).body( result );
    } // f end

    // 3. 경력 수정
    @PutMapping("/update")
    public ResponseEntity< Boolean > onUpdate(
            @RequestHeader("Authorization") String token,
            @RequestBody CareerDto careerDto ){
        int logInDno = 0;
        try{ logInDno = developerService.info( token ).getDno();
        }catch ( Exception e ){ return ResponseEntity.status( 401 ).body( false ); }

        boolean result = careerService.onUpdate( careerDto, logInDno );
        if( !result ){ return ResponseEntity.status( 400 ).body( false ); }
        return ResponseEntity.status( 200 ).body( true );
    } // f end

    // 4. 경력 삭제
    @DeleteMapping("/delete")
    public ResponseEntity< Boolean > onDelete(
            @RequestHeader("Authorization") String token,
            @RequestParam int cano ){
        int logInDno = 0;
        try{ logInDno = developerService.info( token ).getDno();
        }catch ( Exception e ){ return ResponseEntity.status( 401 ).body( false ); }

        boolean result = careerService.onDelete( cano, logInDno );
        if( !result ){ return ResponseEntity.status( 400 ).body( false ); }
        return ResponseEntity.status( 200 ).body( true );
    } // f end


}
