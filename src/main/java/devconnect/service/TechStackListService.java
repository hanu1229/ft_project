package devconnect.service;

import devconnect.model.dto.TechStack.TechStackListDto;
import devconnect.model.dto.TechStack.TechStackListViewDto;
import devconnect.model.dto.TechStack.TeckStackListWriteDto;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.entity.TechStackEntity;
import devconnect.model.entity.TechStackListEntity;
import devconnect.model.repository.DeveloperRepository;
import devconnect.model.repository.TechStackListRepository;
import devconnect.model.repository.TechStackRepository;
import devconnect.util.ExpCalculator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TechStackListService {
    private final TechStackListRepository techStackListRepository;
    private final TechStackRepository techStackRepository;

    private final DeveloperRepository developerRepository;

    // 1. 기술 스택 등록
    public Boolean onWrite(TeckStackListWriteDto dto, int logInDno) {
        if (logInDno < 0) return false;

        DeveloperEntity developer = developerRepository.findById(logInDno).orElse(null);
        if (developer == null) return false;

        // 1. 기존 경험치 차감
        int removeExp = 0;
        List<TechStackListEntity> oldStacks = techStackListRepository.findByDeveloperEntity_Dno(logInDno);
        for (TechStackListEntity tsl : oldStacks) {
            removeExp += tsl.getTechStackEntity().getTsexp();
        }

        // 삭제
        onDelete(logInDno);

        // 2. 새로운 스택 등록 및 경험치 합산
        int addExp = 0;
        List<TechStackListEntity> newStacks = new ArrayList<>();
        for (Integer tsno : dto.getTechStackList()) {
            TechStackEntity stack = techStackRepository.findById(tsno).orElse(null);
            if (stack == null) continue;

            addExp += stack.getTsexp();

            newStacks.add(
                    TechStackListEntity.builder()
                            .developerEntity(developer)
                            .techStackEntity(stack)
                            .build()
            );
        }

        techStackListRepository.saveAll(newStacks);

        // 3. 경험치 재계산 및 반영
        int expChange = addExp - removeExp;
        int[] newLevelAndExp = ExpCalculator.calculateLevelAndExp(
                developer.getDlevel(),
                developer.getDcurrentExp(),
                expChange
        );
        developer.setDlevel(newLevelAndExp[0]);
        developer.setDcurrentExp(newLevelAndExp[1]);
        developer.setDtotalExp(ExpCalculator.getExpForLevel(newLevelAndExp[0]));

        developerRepository.save(developer);
        return true;
    }

    // 2. 기술 스택 조회
    public List<TechStackListViewDto> findByDno( int logInDno ){
        if( logInDno < 0 ){ return null; }
        List<TechStackListEntity> tslEntityList = techStackListRepository.findAll();
        List<TechStackListViewDto> result = tslEntityList.stream()
                .filter( ( tsl ) -> tsl.getDeveloperEntity().getDno() == logInDno )
                .map( ( tsl ) -> {
                    TechStackListViewDto techStackListViewDto = new TechStackListViewDto();
                    techStackListViewDto.setTslno( tsl.getTslno() );
                    techStackListViewDto.setTsno( tsl.getTechStackEntity().getTsno() );
                    techStackListViewDto.setTsname( tsl.getTechStackEntity().getTsname() );
                    return techStackListViewDto;
                })
                .collect( Collectors.toList() );
        return result;
    } // f end

    // 3. 기술 스택 삭제
    public void onDelete( int logInDno ){
        techStackListRepository.deleteByDeveloperEntity_Dno( logInDno );
    } // f end

}
