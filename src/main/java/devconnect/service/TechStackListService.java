package devconnect.service;

import devconnect.model.dto.TechStack.TechStackListDto;
import devconnect.model.dto.TechStack.TechStackListViewDto;
import devconnect.model.dto.TechStack.TeckStackListWriteDto;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.entity.TechStackEntity;
import devconnect.model.entity.TechStackListEntity;
import devconnect.model.repository.TechStackListRepository;
import devconnect.model.repository.TechStackRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class TechStackListService {
    private final TechStackListRepository techStackListRepository;
    private final TechStackRepository techStackRepository;

    // 1. 기술 스택 등록
    public Boolean onWrite( TeckStackListWriteDto teckStackListWriteDto, int logInDno ){
        if( logInDno < 0 ){ return false; }

        List<Integer> tsList = teckStackListWriteDto.getTechStackList();

        List<TechStackListEntity> entities = tsList.stream()
                .map( ( tsno ) -> {
                    DeveloperEntity developer = DeveloperEntity.builder().dno( logInDno ).build();
                    TechStackEntity techStack = TechStackEntity.builder().tsno( tsno ).build();

                    return TechStackListEntity.builder()
                            .developerEntity( developer )
                            .techStackEntity( techStack )
                            .build();
                } )
                .collect( Collectors.toList() );
        techStackListRepository.saveAll( entities );

        return true;
    } // f end

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
