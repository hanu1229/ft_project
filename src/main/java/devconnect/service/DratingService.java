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
    public boolean dratingWrite(DratingDto dratingDto , int loginCno ){
        System.out.println("DratingService.dratingWrite");
        // 입력받은 pno와 dno로 각각 엔티티 조회
        ProjectEntity byPno = projectRepository.findById( dratingDto.getPno())
                .orElseThrow( () -> new RuntimeException("프로젝트 번호가 존재하지 않습니다."));
        DeveloperEntity byDno = developerRepository.findById( dratingDto.getDno() )
                .orElseThrow( () -> new RuntimeException("개발자 번호가 존재하지 않습니다."));
        // pno와 dno에 값이 있을경우 true 없을시 false 반환
        if( byPno != null && byDno != null && byPno.getCompanyEntity().getCno() == loginCno ) {
            // Entity로 변환할때 조회한 엔티티를 포함하여 변환
            DratingEntity dratingEntity = dratingDto.toEntity(byPno, byDno);
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
        // DratingEntity를 Repository를 이용하여 모든 정보 조회
        List<DratingEntity> dratingListAll = dratingRepository.findAll();
        // System.out.println("dratingListAll = " + dratingListAll);
        // 필요한 필요한 정보들만 담은 Dto를 반환할 리스트 객체 생성
        List<DratingDto> dratingList = new ArrayList<>();
        // 조회한 정보의 수 만큼 반복문
        for( int i = 0; i <= dratingListAll.size() -1; i++ ){
            // 정보를 담을 Dto객체를 만들고 필요한 정보만 담기
            DratingDto dratingDto = dratingListAll.get(i).toDto();
            // System.out.println("[**} : " + dratingListAll.get(i));
            // 반환할 리스트객체에 하나씩 저장
            dratingList.add( dratingDto );
        } // for end
        // System.out.println("dratingList = " + dratingList);
        // 리스트 객체 반환
        return dratingList;
    } // f end

    // 개발자 평가 개별 조회
    public DratingDto dratingView( int drno ){
        System.out.println("DratingService.dratingView");
        // drno 를 기반으로 평가 조회
        Optional<DratingEntity> dOptional = dratingRepository.findById( drno );
        System.out.println("dOptional = " + dOptional);
        // 값이 있으면 true 없으면 false 로 조건문
        if ( dOptional.isPresent() ){
            // 값을 Entity객체에 대입
            DratingEntity dratingEntity = dOptional.get();
            // Dto로 변환
            DratingDto dratingDto = dratingEntity.toDto();
            // dto 반환
            return dratingDto;
        } // if end
        // 값이 없으면 null 반환
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
        // 값이 없으면 false 반환
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
