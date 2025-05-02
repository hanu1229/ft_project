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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CratingService {

    private final CratingRepository cratingRepository;
    private final DeveloperRepository developerRepository;
    private final ProjectRepository projectRepository;
    
    // 기업 평가 등록
    public boolean cratingWrite(CratingDto cratingDto , int loginDno ){
        System.out.println("CratingService.cratingWrite");
        // 입력받은 pno와 dno로 각각 엔티티 조회
        ProjectEntity projectEntity = projectRepository.findById( cratingDto.getPno() )
                .orElseThrow( () -> new RuntimeException("프로젝트 번호가 존재하지 않습니다."));
        DeveloperEntity developerEntity = developerRepository.findById( cratingDto.getDno() )
                .orElseThrow( () -> new RuntimeException("기업 번호가 존재하지 않습니다.") );
        // pno , dno 에 값 유무에 따라 true/false 반환
        if( projectEntity != null && developerEntity != null && developerEntity.getDno() == loginDno ){
            CratingEntity cratingEntity = cratingDto.toEntity(projectEntity,developerEntity);
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
    public Page<CratingDto> cratingList(int loginDno , int page , int size , String keyword , int dno ){
        System.out.println("CratingService.cratingList");
        if( loginDno >= 1 ) {
            // Pageable 객체 생성
            Pageable pageable = PageRequest.of(page - 1, size, Sort.by(Sort.Direction.DESC, "crno"));
            // CratingEntity를 Repository를 이용하여 모든 정보 조회
            Page<CratingEntity> cratingListAll = cratingRepository.findBySearch(keyword, pageable , dno);
            // 필요한 필요한 정보들만 담은 Dto를 반환할 리스트 객체 생성
            // List<CratingDto> cratingList = new ArrayList<>();
            Page<CratingDto> cratingDtoList = cratingListAll.map(CratingEntity::toDto);
            return cratingDtoList;
        } // if end
        // 리스트 객체 반환
        return null;
    } // f end

    // 기업 평가 개별 조회
    public CratingDto cratingView( int crno , int loginDno ){
        System.out.println("CratingService.cratingView");
        if ( loginDno >= 1 ) {
            // crno 를 기반으로 평가 조회
            Optional<CratingEntity> optional = cratingRepository.findById(crno);
            // 값이 있으면 true 없으면 false 로 조건문
            if (optional.isPresent()) {
                // 값을 Entity객체에 대입
                CratingEntity cratingEntity = optional.get();
                // Dto로 변환
                CratingDto cratingDto = cratingEntity.toDto();
                // dto 반환
                return cratingDto;
            } // if end
        } // if end
        // 값이 없으면 null 반환
        return null;
    } // f end
    
    // 기업 평가 수정
    public boolean cratingUpdate( CratingDto cratingDto , int loginDno ){
        System.out.println("CratingService.cratingUpdate");
        // dto에 입력한 crno로 해당 엔티티 조회
        Optional<CratingEntity> optional = cratingRepository.findById( cratingDto.getCrno() );
        // 값이 있으면 true 없으면 false로 조건문
        if( optional.isPresent() ){
            // 값을 Entity 객체에 대입
            CratingEntity cratingEntity = optional.get();
            // 기업을 수정 하는 dno와 기업을 등록했던 dno가 같은지 조건문
            if( cratingEntity.getDeveloperEntity().getDno() == loginDno ) {
                // dto에 입력한 값으로 Entity 수정
                cratingEntity.setCtitle(cratingDto.getCtitle());
                cratingEntity.setCcontent(cratingDto.getCcontent());
                cratingEntity.setCrscore(cratingDto.getCrscore());
                cratingEntity.setCrstate(cratingDto.getCrstate());
                // 값 수정후 true 반환
                return true;
            } // if end
        } // if end
        // 값이 없으면 false 반환
        return false;
    } // f end

    // 기업 평가 삭제
    public boolean cratingDelete( int crno , int loginDno ){
        System.out.println("CratingService.cratingDelete");
        // crno에 해당하는 엔티티 조회
        Optional<CratingEntity> optional = cratingRepository.findById( crno );
        // 값이 있으면 true 없으면 false로 조건문
        if( optional.isPresent() ){
            // 값을 Entity 객체에 대입
            CratingEntity cratingEntity = optional.get();
            // 평가를 등록했던 개발자와 삭제버튼을 누르는 개발자와 dno가 같은지 확인
            if( cratingEntity.getDeveloperEntity().getDno() == loginDno ) {
                // Entity 객체에서 Drno를 찾아서 그걸 기반으로 데이터삭제
                cratingRepository.deleteById(cratingEntity.getCrno());
                return true;
            } // if end
        } // if end
        // 값이 없으면 false 반환
        return false;
    } // f end

} // c end
