package devconnect.service;

import devconnect.model.dto.CareerDto;
import devconnect.model.entity.CareerEntity;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.repository.CareerRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CareerService {
    private final CareerRepository careerRepository;

    // 1. 경력 등록
    public boolean onWrite( CareerDto careerDto, int logInDno ){
        if( logInDno < 0 ){ return false; }
        CareerEntity careerEntity = careerDto.toEntity();
        DeveloperEntity developer = DeveloperEntity.builder().dno( logInDno ).build();
        careerEntity.setDeveloperEntity( developer );

        CareerEntity saveEntity = careerRepository.save( careerEntity );

        return true;
    } // f end

    // 2. 경력 조회
    public List<CareerDto> findByDno( int logInDno ){
        if( logInDno < 0 ){ return null; }
        List<CareerEntity> careerEntityList = careerRepository.findAll();

        List<CareerDto> result = careerEntityList.stream()
                .filter( (entity) -> entity.getDeveloperEntity().getDno() == logInDno )
                .map( CareerEntity::toDto )
                .toList();
        return result;
    } // f end

    // 3. 경력 수정
    public Boolean onUpdate( CareerDto careerDto, int logInDno ){
        if( logInDno < 0 ){ return null; }

        return true;
    } // f end

    // 4. 경력 삭제
    public Boolean onDelete( int cano, int logInDno ){
        if( logInDno < 0 ){ return null; }

        return true;
    } // f end

}
