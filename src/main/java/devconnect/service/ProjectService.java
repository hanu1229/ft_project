package devconnect.service;

import devconnect.model.dto.ProjectDto;
import devconnect.model.entity.ProjectEntity;
import devconnect.model.repository.ProjectRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    private final ProjectRepository projectRepository;

    /// ● 프로젝트 등록
    public boolean writeProject(ProjectDto projectDto) {
        System.out.println("ProjectService.writeProject");
        System.out.println("projectDto = " + projectDto);
        ProjectEntity projectEntity = projectRepository.save(projectDto.toEntity());
        if(projectEntity.getPno() > 0) {
            return true;
        }
        return false;
    }

    /// ● 프로젝트 조회
    public List<ProjectDto> findAllProject() {
        System.out.println("ProjectService.findAllProject");
        List<ProjectEntity> projectEntityList = projectRepository.findAll();
        List<ProjectDto> projectDtoList = new ArrayList<>();
        if(!projectEntityList.isEmpty()) {
            for(int index = 0; index < projectEntityList.size(); index++) {
                projectDtoList.add(projectEntityList.get(index).toDto());
            }
        }
        return projectDtoList;
    }

    /// ● 프로젝트 수정


    /// ● 프로젝트 삭제

}
