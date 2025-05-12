package devconnect.controller;

import devconnect.model.dto.TechStack.TechStackListViewDto;
import devconnect.model.dto.TechStack.TeckStackListWriteDto;
import devconnect.service.DeveloperService;
import devconnect.service.TechStackListService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/techstack/list")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TechStackListController {
    private final TechStackListService techStackListService;
    private final DeveloperService developerService;

    // 1. 기술 스택 등록
    @PostMapping("/write")
    public ResponseEntity< Boolean > onWrite(
            @RequestHeader("Authorization") String token,
            @RequestBody TeckStackListWriteDto teckStackListWriteDto ){
        int logInDno = 0;
        try{ logInDno = developerService.info( token ).getDno();
        }catch (Exception e){ return ResponseEntity.status( 401 ).body( false ); }

        if( teckStackListWriteDto.getTslno() != null ){
            techStackListService.onDelete( logInDno );
        }

        boolean result = techStackListService.onWrite( teckStackListWriteDto, logInDno );
        if( result ){ return ResponseEntity.status( 200 ).body( true ); }
        else{ return ResponseEntity.status( 400 ).body( false ); }

    } // f end

    // 2. 기술 스택 조회
    @GetMapping("/findall")
    public ResponseEntity< List<TechStackListViewDto> > findByDno(
            @RequestHeader("Authorization") String token ){
        int logInDno = 0;
        try{ logInDno = developerService.info( token ).getDno();
        }catch (Exception e){ return ResponseEntity.status( 401 ).body( null ); }

        List<TechStackListViewDto> result = techStackListService.findByDno( logInDno );
        return ResponseEntity.status( 200 ).body( result );
    } // f end

}
