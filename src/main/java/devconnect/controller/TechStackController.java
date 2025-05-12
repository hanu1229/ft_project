package devconnect.controller;

import devconnect.model.dto.TechStack.TechStackDto;
import devconnect.service.TechStackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/techstack")
@RequiredArgsConstructor
@CrossOrigin("*")
public class TechStackController {
    private final TechStackService techStackService;

    // 1. 기술스택 등록
//    @PostMapping("/write")
//    public ResponseEntity< Boolean > onWrite( @RequestBody TechStackDto techStackDto ){
//
//    }

    // 2. 기술스택 조회
    @GetMapping("/findall")
    public ResponseEntity< List<TechStackDto> > findAll(){
        List<TechStackDto> result = techStackService.findAll();
        return ResponseEntity.status( 200 ).body( result );
    } // f end

    // 3. 기술스택 수정

    // 4. 기술스택 삭제
}
