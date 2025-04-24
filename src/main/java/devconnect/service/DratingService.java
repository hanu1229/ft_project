package devconnect.service;

import devconnect.model.dto.DratingDto;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.entity.DratingEntity;
import devconnect.model.entity.ProjectEntity;
import devconnect.model.repository.DeveloperRepository;
import devconnect.model.repository.DratingRepository;
import devconnect.model.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class DratingService {

    private final DratingRepository dratingRepository;
    private final ProjectRepository projectRepository;
    private final DeveloperRepository developerRepository;
    
    // 개발자 평가 등록
    public boolean dratingWrite(DratingDto dratingDto ){
        System.out.println("DratingService.dratingWrite");
        // 입력받은 pno와 dno로 각각 엔티티 조회
        ProjectEntity pno = projectRepository.findById( dratingDto.getPno())
                .orElseThrow( () -> new RuntimeException("프로젝트 번호가 존재하지 않습니다."));
        DeveloperEntity dno = developerRepository.findById( dratingDto.getDno() )
                .orElseThrow( () -> new RuntimeException("개발자 번호가 존재하지 않습니다."));
        // pno와 dno에 값이 있을경우 true 없을시 false 반환
        if( pno != null && dno != null ) {
            // Entity로 변환할때 조회한 엔티티를 포함하여 변환
            DratingEntity dratingEntity = dratingDto.toEntity(pno, dno);
            // Entity에 저장
            DratingEntity saveEntity = dratingRepository.save(dratingEntity);
            // 결과 반환
            if (saveEntity.getDrno() >= 1) {
                return true;
            } // if end
        } // if end
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
        System.out.println("dratingDto = " + dratingDto);
        // dto에 입력한 drno로 해당 엔티티 조회
        Optional<DratingEntity> optional = dratingRepository.findById( dratingDto.getDrno() );
        System.out.println("optional = " + optional);
        if( optional.isPresent() ){
            // 엔티티 타입으로 변환
            DratingEntity dratingEntity = optional.get();
            System.out.println("dratingEntity = " + dratingEntity);
            // 수정
            dratingEntity.setDrscore( dratingDto.getDrscore() );
            dratingEntity.setDrstate( dratingDto.getDrstate() );
            return true;
        } // if end
        return false;
    } // f end
    
    // 개발자 평가 삭제
    public boolean dratingDelete( int drno ){
        System.out.println("DratingService.dratingDelete");
        // 입력받은 drno로 엔티티 조회
        Optional< DratingEntity > optional = dratingRepository.findById( drno );
        // 조건문으로 엔티티 유무 확인
        if( optional.isPresent() ){
            // 엔티티로 타입변환
            DratingEntity dratingEntity = optional.get();
            // 조회한 엔티티의 식별번호를 매개변수로 사용하여 삭제작업
            dratingRepository.deleteById( dratingEntity.getDrno() );
            return true;
        } // if end
        return false;
    } // f end

} // c end
