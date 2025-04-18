package devconnect.service;

import devconnect.model.dto.DratingDto;
import devconnect.model.repository.DratingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DratingService {

    private final DratingRepository dratingRepository;
    
    // 개발자 평가 등록
    public boolean dratingWrite(DratingDto dratingDto ){
        System.out.println("DratingService.dratingWrite");
        return true;
    } // f end
    
    // 개발자 평가 전체 조회
    public List<DratingDto> dratingList(){
        System.out.println("DratingService.dratingList");
        return null;
    } // f end
    
    // 개발자 평가 수정
    public boolean dratingUpdate( DratingDto dratingDto ){
        System.out.println("DratingService.dratingUpdate");
        return true;
    } // f end
    
    // 개발자 평가 삭제
    public boolean dratingDelete( int drno ){
        System.out.println("DratingService.dratingDelete");
        return true;
    } // f end

} // c end
