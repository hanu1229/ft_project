package devconnect.controller;

import devconnect.model.dto.ProjectDto;
import devconnect.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProjectController {

    // 추후 토큰으로 변경

    private final ProjectService projectService;
    
    /// ● 프로젝트 등록
    // {"pname" : "테스트 [백엔드]", "pintro" : "테스트 소개", "ptype" : 1, "pcomment" : "테스트 상세 설명", "pcount" : 4, "pstart" : "2025-04-21T13:00:00", "pend" : "2025-05-20T13:00:00", "recruit_pstart" : "2025-06-15T13:00:00", "recruit_pend" : "2025-12-12T13:00:00", "ppay" : 2700, "cno" : 1}
    // {"pname" : "테스트 [백엔드]", "pintro" : "테스트 소개", "ptype" : 1, "pcomment" : "테스트 상세 설명", "pcount" : 4, "pstart" : "2025-04-21T13:00:00", "pend" : "2025-05-20T13:00:00", "recruit_pstart" : "2025-06-15T13:00:00", "recruit_pend" : "2025-12-12T13:00:00", "ppay" : 2700}
    @PostMapping("")
    public boolean writeProject(@RequestHeader("Authorization") String token, @RequestBody() ProjectDto projectDto) {
        System.out.println("ProjectController.writeProject");
        System.out.println("token = " + token + "\nprojectDto = " + projectDto);
        return projectService.writeProject(token, projectDto);
    }
    
    /// ● 프로젝트 조회
    @GetMapping("")
    public List<ProjectDto> findAllProject() {
        System.out.println("ProjectController.findAllProject");
        return projectService.findAllProject();
    }

    /// ● 프로젝트 수정
    // {"pno" : 1, "pname" : "수정 테스트 [백엔드]", "pintro" : "수정 테스트 소개", "ptype" : 1, "pcomment" : "수정 테스트 상세 설명", "pcount" : 2, "pstart" : "2025-04-21T13:00:00", "pend" : "2025-05-20T13:00:00", "recruit_pstart" : "2025-06-15T13:00:00", "recruit_pend" : "2025-12-12T13:00:00", "ppay" : 3200}
    @PutMapping("")
    public boolean updateProject(@RequestBody() ProjectDto projectDto) {
        System.out.println("ProjectController.updateProject");
        System.out.println("projectDto = " + projectDto);
        return projectService.updateProject(projectDto);
    }

    /// ● 프로젝트 삭제
    @DeleteMapping("")
    public boolean deleteProject(@RequestParam(name = "pno") int pno) {
        System.out.println("ProjectController.deleteProject");
        System.out.println("pno = " + pno);
        return projectService.deleteProject(pno);
    }


}
