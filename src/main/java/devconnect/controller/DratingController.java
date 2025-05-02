package devconnect.controller;

import devconnect.model.dto.DratingDto;
import devconnect.model.repository.CompanyRepository;
import devconnect.model.repository.DeveloperRepository;
import devconnect.service.CompanyService;
import devconnect.service.DratingService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
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
@RequestMapping("/api/drating")
@CrossOrigin("*")
public class DratingController {

    private final DratingService dratingService;
    private final CompanyService companyService;

    // 개발자 평가 등록
    // [POST] : http://localhost:8080/api/drating
    // { "drscore" : # , "pno" : # , "dno" : # }
    @PostMapping("")
    public ResponseEntity<Boolean> dratingWrite(
            @RequestHeader("Authorization")  String token ,
            @RequestBody DratingDto dratingDto ) {
        System.out.println("DratingController.dratingWrite");
        int loginCno;
        // 토큰의 cno 추출
        try {
            loginCno = companyService.info(token).getCno();
        } catch (Exception e) { return ResponseEntity.status(201).body(false); }
        // 입력한 값들과 추출한 cno를 서비스로 보내서 결과 반환 받기
        boolean result = dratingService.dratingWrite(dratingDto, loginCno);
        if (result) {
            return ResponseEntity.status(201).body(true);
        } else {
            return ResponseEntity.status(400).body(false);
        }
    } // f end

    // 개발자 평가 전체 조회
    // [GET] : http://localhost:8080/api/drating
    @GetMapping("")
    public ResponseEntity<Page<DratingDto>> dratingList(
            @RequestParam( defaultValue = "1" ) int page,
            @RequestParam( defaultValue = "5" ) int size,
            @RequestParam( required = false ) String keyword,
            @RequestParam( defaultValue = "0" ) int dno,
            @RequestHeader("Authorization") String token ){
        System.out.println("DratingController.dratingList");
        Page<DratingDto> findAll = dratingService.dratingList( token , page , size , keyword , dno );
        if( findAll != null ){
            return ResponseEntity.ok(findAll);
        }else{
            return ResponseEntity.noContent().build(); // 204
        }
    } // f end

    // 개발자 평가 개별 조회
    // [GET] : http://localhost:8080/api/drating/view?drno=#
    @GetMapping("/view")
    public ResponseEntity<DratingDto> dratingView(
            @RequestHeader("Authorization") String token ,
            @RequestParam("drno") int drno ){
        System.out.println("DratingController.dratingView");
        DratingDto dratingDto = dratingService.dratingView( drno , token );
        if( dratingDto != null ) { return ResponseEntity.status(200).body( dratingDto ); }
        else{ return ResponseEntity.status(401).build(); }
    } // f end


    // 개발자 평가 수정
    // [PUT] : http://localhost:8080/api/drating
    // { "drno" : # , "drscore" : # }
    // 평가할 개발자와 평가를 하게된 배경인 프로젝트를 수정할 필요는 없어서 pno,dno 제외
    @PutMapping("")
    public ResponseEntity<Boolean> dratingUpdate(
            @RequestHeader("Authorization") String token ,
            @RequestBody DratingDto dratingDto ){
        System.out.println("DratingController.dratingUpdate");
        boolean result = dratingService.dratingUpdate( dratingDto , token );
        if( result ){ return ResponseEntity.status(201).body(true);}
        else{ return ResponseEntity.status(400).body(false); }
    } // f end

    // 개발자 평가 삭제
    // [DELETE] : http://localhost:8080/api/drating?drno=#
    @DeleteMapping("")
    public ResponseEntity<Boolean> dratingDelete(
            @RequestHeader("Authorization") String token ,
            @RequestParam("drno") int drno ){
        System.out.println("DratingController.dratingDelete");
        boolean result = dratingService.dratingDelete( drno , token );
        if( result ){ return ResponseEntity.status(201).body(true); }
        else{ return ResponseEntity.status(400).body(false); }
    } // f end

} // c end

