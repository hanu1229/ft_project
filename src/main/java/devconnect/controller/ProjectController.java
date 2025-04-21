package devconnect.controller;

import devconnect.model.dto.ProjectDto;
import devconnect.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProjectController {

    private final ProjectService projectService;
    
    /// ● 프로젝트 등록
    @PostMapping("")
    public boolean writeProject(@RequestBody() ProjectDto projectDto) {
        System.out.println("ProjectController.writeProject");
        System.out.println("projectDto = " + projectDto);
        return projectService.writeProject(projectDto);
    }
    
    /// ● 프로젝트 조회
    @GetMapping("")
    public List<ProjectDto> findAllProject() {
        System.out.println("ProjectController.findAllProject");
        return projectService.findAllProject();
    }

    /// ● 프로젝트 수정


    /// ● 프로젝트 삭제
    

}
