package devconnect.service;

import devconnect.model.dto.CareerDto;
import devconnect.model.entity.CareerEntity;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.repository.CareerRepository;
import devconnect.model.repository.DeveloperRepository;
import devconnect.util.ExpCalculator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CareerService {
    private final CareerRepository careerRepository;
    private final DeveloperRepository developerRepository;

    public boolean onWrite(CareerDto careerDto, int logInDno) {
        if (logInDno < 0) return false;

        CareerEntity careerEntity = careerDto.toEntity();
        DeveloperEntity developer = developerRepository.findById(logInDno).orElse(null);
        if (developer == null) return false;

        careerEntity.setDeveloperEntity(developer);

        // 경력 기간 계산
        LocalDate start = careerDto.getCaStartDate();
        LocalDate end = careerDto.getCaEndDate() != null ? careerDto.getCaEndDate() : LocalDate.now();
        long days = ChronoUnit.DAYS.between(start, end);
        int gainedExp = (int) days * 2;

        // 경험치 정산 (ExpCalculator 사용)
        int[] result = ExpCalculator.calculateLevelAndExp(developer.getDlevel(), developer.getDcurrentExp(), gainedExp);
        developer.setDlevel(result[0]);
        developer.setDcurrentExp(result[1]);
        developer.setDtotalExp(ExpCalculator.getExpForLevel(result[0]));

        // 저장
        careerRepository.save(careerEntity);
        developerRepository.save(developer);

        return true;
    }

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
    public boolean onDelete( int cano, int logInDno ) {
        if ( logInDno < 0 ){ return false; }

        CareerEntity careerEntity = careerRepository.findById(cano).orElse(null);
        if (careerEntity == null){ return false; }

        DeveloperEntity developer = developerRepository.findById(logInDno).orElse(null);
        if (developer == null){ return false; }

        // 경력 기간 계산
        LocalDate start = careerEntity.getCaStartDate();
        LocalDate end = careerEntity.getCaEndDate() != null ? careerEntity.getCaEndDate() : LocalDate.now();
        long days = ChronoUnit.DAYS.between( start, end );
        int expToRemove = (int) days * 2;

        // 경험치 차감
        int[] result = ExpCalculator.calculateLevelAndExp (developer.getDlevel(), developer.getDcurrentExp(), -expToRemove );
        developer.setDlevel( result[0] );
        developer.setDcurrentExp( result[1] );
        developer.setDtotalExp( ExpCalculator.getExpForLevel( result[0] ) );

        // 삭제 처리
        careerRepository.delete(careerEntity);
        developerRepository.save(developer);

        return true;
    }

}
