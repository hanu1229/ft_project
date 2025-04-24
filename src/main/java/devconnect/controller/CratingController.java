package devconnect.controller;

import devconnect.model.dto.CratingDto;
import devconnect.service.CratingService;
import devconnect.service.DeveloperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
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
    private final DeveloperService developerService;
    
    // 기업 평가 등록
    // [POST] : http://localhost:8080/api/crating
    // { "crscore" : # , "pno" : # , "dno" : # }
    @PostMapping("")
    public ResponseEntity<Boolean> cratingWrite(
            @RequestHeader("Authorization") String token ,
            @RequestBody CratingDto cratingDto){
        System.out.println("CratingController.cratingWrite");
        int loginDno;
        // 토큰으로 dno 추출
        try{
            loginDno = developerService.info(token).getDno();
        }catch (Exception e ){ return ResponseEntity.status(201).body(false); }
        // 입력한 값들과 추출한 dno를 서비스로 보내서 결과 반환 받기
        boolean result = cratingService.cratingWrite( cratingDto , loginDno );
        if( result ){
            return ResponseEntity.status(201).body(true);
        }else{
            return ResponseEntity.status(400).body(false);
        } // if end
    } // f end
    
    // 기업 평가 전체 조회
    // [GET] : http://localhost:8080/api/crating
    @GetMapping("")
    public ResponseEntity<List<CratingDto>> cratingList(
            @RequestHeader("Authorization") String token ){
        System.out.println("CratingController.cratingList");
        int loginDno;
        try{
            loginDno = developerService.info(token).getDno();
        }catch (Exception e ){ return ResponseEntity.noContent().build(); }
        List<CratingDto> findAll = cratingService.cratingList( loginDno );
        if( findAll != null ){
            return ResponseEntity.ok( findAll );
        }else{
            return ResponseEntity.noContent().build(); // 204
        } // if end
    } // f end
    
    // 기업 평가 개별 조회
    // [GET] : http://localhost:8080/api/crating/view?crno=#
    @GetMapping("view")
    public ResponseEntity<CratingDto> cratingView(
            @RequestHeader("Authorization") String token ,
            @RequestParam("crno") int crno ){
        System.out.println("CratingController.cratingView");
        int loginDno;
        try{
            loginDno = developerService.info(token).getDno();
        }catch (Exception e ) { return ResponseEntity.status(401).build(); }
        CratingDto cratingDto = cratingService.cratingView( crno , loginDno );
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
    public ResponseEntity<Boolean> cratingUpdate(
            @RequestHeader("Authorization") String token ,
            @RequestBody CratingDto cratingDto ){
        System.out.println("CratingController.cratingUpdate");
        int loginDno;
        try{
            loginDno = developerService.info(token).getDno();
        }catch (Exception e ){ return ResponseEntity.status(400).body(false); }
        boolean result = cratingService.cratingUpdate( cratingDto , loginDno );
        if( result ){
            return ResponseEntity.status(201).body(true);
        }else{
            return ResponseEntity.status(400).body(false);
        } // if end
    } // f end
    
    // 기업 평가 삭제
    // [DELETE] : http://localhost:8080/api/crating?crno=#
    @DeleteMapping("")
    public ResponseEntity<Boolean> cratingDelete(
            @RequestHeader("Authorization") String token ,
            @RequestParam("crno") int crno ){
        System.out.println("CratingController.cratingDelete");
        int loginDno;
        try{
            loginDno = developerService.info(token).getDno();
        }catch (Exception e ){ return ResponseEntity.status(400).body(false); }
        boolean result = cratingService.cratingDelete( crno , loginDno );
        if( result ){
            return ResponseEntity.status(201).body(true);
        }else{
            return ResponseEntity.status(400).body(false);
        } // if end
    } // f end
    
    
} // c end
