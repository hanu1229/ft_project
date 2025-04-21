package devconnect.controller;

import devconnect.model.dto.DratingDto;
import devconnect.service.DratingService;
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
@RequestMapping("/api/drating")
@CrossOrigin("*")
public class DratingController {

    private final DratingService dratingService;
    
    // 개발자 평가 등록
    @PostMapping("")
    public boolean dratingWrite( @RequestBody DratingDto dratingDto ){
        System.out.println("DratingController.dratingWrite");
        return dratingService.dratingWrite( dratingDto );
    } // f end
    
    // 개발자 평가 전체 조회
    @GetMapping("")
    public List<DratingDto> dratingList(){
        System.out.println("DratingController.dratingList");
        return dratingService.dratingList();
    } // f end
    
    // 개발자 평가 수정
    @PutMapping("")
    public boolean dratingUpdate(@RequestBody DratingDto dratingDto ){
        System.out.println("DratingController.dratingUpdate");
        return dratingService.dratingUpdate( dratingDto );
    } // f end
    
    // 개발자 평가 삭제
    @DeleteMapping("")
    public boolean dratingDelete(@RequestParam("drno") int drno ){
        System.out.println("DratingController.dratingDelete");
        return dratingService.dratingDelete( drno );
    } // f end

} // c end
