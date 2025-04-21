package devconnect.controller;

import devconnect.model.dto.CratingDto;
import devconnect.service.CratingService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/crating")
@CrossOrigin("*")
public class CratingController {

    private final CratingService cratingService;
    
    // 기업 평가 등록
    @PostMapping("")
    public boolean cratingWrite(@RequestBody CratingDto cratingDto){
        System.out.println("CratingController.cratingWrite");
        return cratingService.cratingWrite( cratingDto );
    } // f end
    
    // 기업 평가 전체 조회
    @GetMapping("")
    public List<CratingDto> cratingList(){
        System.out.println("CratingController.cratingList");
        return cratingService.cratingList();
    } // f end
    
    // 기업 평가 수정
    @PutMapping("")
    public boolean cratingUpdate( @RequestBody CratingDto cratingDto ){
        System.out.println("CratingController.cratingUpdate");
        return cratingService.cratingUpdate( cratingDto );
    } // f end
    
    // 기업 평가 삭제
    @DeleteMapping("")
    public boolean cratingDelete(@RequestParam("crno") int crno ){
        System.out.println("CratingController.cratingDelete");
        return cratingService.cratingDelete( crno );
    } // f end
    
    
} // c end
