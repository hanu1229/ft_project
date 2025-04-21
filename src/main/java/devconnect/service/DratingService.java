package devconnect.service;

import devconnect.model.dto.DratingDto;
import devconnect.model.entity.DratingEntity;
import devconnect.model.repository.DratingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DratingService {

    private final DratingRepository dratingRepository;
    
    // 개발자 평가 등록
    public boolean dratingWrite(DratingDto dratingDto ){
        System.out.println("DratingService.dratingWrite");
        DratingEntity dratingEntity = dratingDto.toEntity();
        DratingEntity saveEntity = dratingRepository.save( dratingEntity );
        if( saveEntity.getDrno() >= 1 ){ return true; }
        return false;
    } // f end
    
    // 개발자 평가 전체 조회
    public List<DratingDto> dratingList(){
        System.out.println("DratingService.dratingList");
        List<DratingEntity> dratingListAll = dratingRepository.findAll();
        List<DratingDto> dratingList = new ArrayList<>();
        for( int i = 0; i <= dratingListAll.size() -1; i++ ){
            DratingDto dratingDto = dratingListAll.get(i).toDto();
            dratingList.add( dratingDto );
        } // for end
        return dratingList;
    } // f end

    // 개발자 평가 개별 조회
    public DratingDto dratingView( int drno ){
        System.out.println("DratingService.dratingView");
        Optional<DratingEntity> dOptional = dratingRepository.findById( drno );
        if ( dOptional.isPresent() ){
            DratingEntity dratingEntity = dOptional.get();
            DratingDto dratingDto = dratingEntity.toDto();
            return dratingDto;
        } // if end
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
