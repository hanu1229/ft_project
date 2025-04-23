package devconnect.controller;

import devconnect.model.dto.CratingDto;
import devconnect.service.CratingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    // [POST] : http://localhost:8080/api/crating
    // { "crscore" : # , "pno" : # , "dno" : # }
    @PostMapping("")
    public ResponseEntity<Boolean> cratingWrite(@RequestBody CratingDto cratingDto){
        System.out.println("CratingController.cratingWrite");
        boolean result = cratingService.cratingWrite( cratingDto );
        if( result ){
            return ResponseEntity.status(201).body(true);
        }else{
            return ResponseEntity.status(400).body(false);
        } // if end
    } // f end
    
    // 기업 평가 전체 조회
    // [GET] : http://localhost:8080/api/crating
    @GetMapping("")
    public ResponseEntity<List<CratingDto>> cratingList(){
        System.out.println("CratingController.cratingList");
        List<CratingDto> findAll = cratingService.cratingList();
        if( findAll != null ){
            return ResponseEntity.ok( findAll );
        }else{
            return ResponseEntity.noContent().build(); // 204
        } // if end
    } // f end
    
    // 기업 평가 개별 조회
    // [GET] : http://localhost:8080/api/crating/view?crno=#
    @GetMapping("view")
    public ResponseEntity<CratingDto> cratingView( @RequestParam("crno") int crno ){
        System.out.println("CratingController.cratingView");
        CratingDto cratingDto = cratingService.cratingView( crno );
        if( cratingDto != null ){
            return ResponseEntity.status(200).body( cratingDto );
        }else{
            return ResponseEntity.status(401).build();
        } // if end
    } // f end
    
    // 기업 평가 수정
    // [PUT] : http://localhost:8080/api/crating
    // { "crno" : # , "crscore" : # }
    // 평가할 기업과 평가를 하게된 배경인 프로젝트를 수정할 필요는 없어서 pno,dno 제외
    @PutMapping("")
    public ResponseEntity<Boolean> cratingUpdate( @RequestBody CratingDto cratingDto ){
        System.out.println("CratingController.cratingUpdate");
        boolean result = cratingService.cratingUpdate( cratingDto );
        if( result ){
            return ResponseEntity.status(201).body(true);
        }else{
            return ResponseEntity.status(400).body(false);
        } // if end
    } // f end
    
    // 기업 평가 삭제
    // [DELETE] : http://localhost:8080/api/crating?crno=#
    @DeleteMapping("")
    public ResponseEntity<Boolean> cratingDelete(@RequestParam("crno") int crno ){
        System.out.println("CratingController.cratingDelete");
        boolean result = cratingService.cratingDelete( crno );
        if( result ){
            return ResponseEntity.status(201).body(true);
        }else{
            return ResponseEntity.status(400).body(false);
        } // if end
    } // f end
    
    
} // c end
