package devconnect.service;

import devconnect.model.dto.TechStack.ProjectTechStackViewDto;
import devconnect.model.dto.TechStack.ProjectTechStackWriteDto;
import devconnect.model.entity.*;
import devconnect.model.repository.ProjectTechStackRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectTechStackService {
    private final ProjectTechStackRepository projectTechStackRepository;
    private final DeveloperService developerService;

    // 1. 프로젝트 기술 스택 등록
    public boolean onWrite(
            ProjectTechStackWriteDto projectTechStackWriteDto, int logInDno ){
        if( logInDno < 0 ){ return false; }

        List<Integer> ptsList = projectTechStackWriteDto.getProjectTechStackList();
        int pno = projectTechStackWriteDto.getPno();

        List<ProjectTechStackEntity> entities = ptsList.stream()
                .map( ( tsno ) -> {
                    ProjectEntity project = ProjectEntity.builder().pno( pno ).build();
                    TechStackEntity techStack = TechStackEntity.builder().tsno( tsno ).build();

                    return ProjectTechStackEntity.builder()
                            .projectEntity( project )
                            .techStackEntity( techStack )
                            .build();
                } )
                .collect( Collectors.toList() );
        projectTechStackRepository.saveAll( entities );

        return true;
    } // f end

    // 2. 프로젝트 기술 스택 조회
    public List<ProjectTechStackViewDto> findByPno( int pno ){
        List<ProjectTechStackEntity> ptsEntityList = projectTechStackRepository.findAll();
        List<ProjectTechStackViewDto> result = ptsEntityList.stream()
                .filter( ( pts ) -> pts.getProjectEntity().getPno() == pno )
                .map( ( pts ) -> {
                    ProjectTechStackViewDto projectTechStackViewDto = new ProjectTechStackViewDto();
                    projectTechStackViewDto.setPtsno( pts.getPtsno() );
                    projectTechStackViewDto.setTsno( pts.getTechStackEntity().getTsno() );
                    projectTechStackViewDto.setTsname( pts.getTechStackEntity().getTsname() );
                    return projectTechStackViewDto;
                })
                .collect( Collectors.toList() );
        return result;
    } // f end

    // 3. 프로젝트 기술 스택 삭제
    public void onDelete( int pno ){
        projectTechStackRepository.deleteByProjectEntity_Pno( pno );
    } // f end

}
