package devconnect.service;

import devconnect.model.dto.CratingDto;
import devconnect.model.entity.CratingEntity;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.entity.DratingEntity;
import devconnect.model.entity.ProjectEntity;
import devconnect.model.repository.CratingRepository;
import devconnect.model.repository.DeveloperRepository;
import devconnect.model.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CratingService {

    private final CratingRepository cratingRepository;
    private final DeveloperRepository developerRepository;
    private final ProjectRepository projectRepository;
    
    // 기업 평가 등록
    public boolean cratingWrite(CratingDto cratingDto ){
        System.out.println("CratingService.cratingWrite");
        // 입력받은 pno와 dno로 각각 엔티티 조회
        ProjectEntity pno = projectRepository.findById( cratingDto.getPno() )
                .orElseThrow( () -> new RuntimeException("프로젝트 번호가 존재하지 않습니다."));
        DeveloperEntity dno = developerRepository.findById( cratingDto.getDno() )
                .orElseThrow( () -> new RuntimeException("기업 번호가 존재하지 않습니다.") );
        // pno , dno 에 값 유무에 따라 true/false 반환
        if( pno != null && dno != null ){
            CratingEntity cratingEntity = cratingDto.toEntity(pno,dno);
            // ENtity에 저장
            CratingEntity saveEntity = cratingRepository.save(cratingEntity);
            // 결과 반환
            if( saveEntity.getCrno() >= 1 ){
                return true;
            } // if end
        } // if end
        return false;
    } // f end
    
    // 기업 평가 전체 조회
    public List<CratingDto> cratingList(){
        System.out.println("CratingService.cratingList");
        // CratingEntity를 Repository를 이용하여 모든 정보 조회
        List<CratingEntity> cratingListAll = cratingRepository.findAll();
        // 필요한 필요한 정보들만 담은 Dto를 반환할 리스트 객체 생성
        List<CratingDto> cratingList = new ArrayList<>();
        // 조회한 정보의 수 만큼 반복문
        for( int i = 0; i <= cratingListAll.size() -1; i++ ){
            // 정보를 담을 Dto객체를 만들고 필요한 정보만 담기
            CratingDto cratingDto = cratingListAll.get(i).toDto();
            // 반환할 리스트객체에 하나씩 저장
            cratingList.add( cratingDto );
        } // for end
        // 리스트 객체 반환
        return cratingList;
    } // f end

    // 기업 평가 개별 조회
    public CratingDto cratingView( int crno ){
        System.out.println("CratingService.cratingView");
        // crno 를 기반으로 평가 조회
        Optional< CratingEntity > optional = cratingRepository.findById( crno );
        // 값이 있으면 true 없으면 false 로 조건문
        if( optional.isPresent() ){
            // 값을 Entity객체에 대입
            CratingEntity cratingEntity = optional.get();
            // Dto로 변환
            CratingDto cratingDto = cratingEntity.toDto();
            // dto 반환
            return cratingDto;
        } // if end
        // 값이 없으면 null 반환
        return null;
    } // f end
    
    // 기업 평가 수정
    public boolean cratingUpdate( CratingDto cratingDto ){
        System.out.println("CratingService.cratingUpdate");
        // dto에 입력한 crno로 해당 엔티티 조회
        Optional<CratingEntity> optional = cratingRepository.findById( cratingDto.getCrno() );
        // 값이 있으면 true 없으면 false로 조건문
        if( optional.isPresent() ){
            // 값을 Entity 객체에 대입
            CratingEntity cratingEntity = optional.get();
            // dto에 입력한 값으로 Entity 수정
            cratingEntity.setCrscore( cratingDto.getCrscore() );
            cratingEntity.setCrstate( cratingDto.getCrstate() );
            // 값 수정후 true 반환
            return true;
        } // if end
        // 값이 없으면 false 반환
        return false;
    } // f end

    // 기업 평가 삭제
    public boolean cratingDelete( int crno ){
        System.out.println("CratingService.cratingDelete");
        // crno에 해당하는 엔티티 조회
        Optional<CratingEntity> optional = cratingRepository.findById( crno );
        // 값이 있으면 true 없으면 false로 조건문
        if( optional.isPresent() ){
            // 값을 Entity 객체에 대입
            CratingEntity cratingEntity = optional.get();
            // Entity 객체에서 Drno를 찾아서 그걸 기반으로 데이터삭제
            cratingRepository.deleteById( cratingEntity.getCrno() );
            return true;
        } // if end
        // 값이 없으면 false 반환
        return false;
    } // f end

} // c end
