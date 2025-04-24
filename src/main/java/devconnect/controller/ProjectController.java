package devconnect.controller;

import devconnect.model.dto.ProjectDto;
import devconnect.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProjectController {

    // 모두 토큰으로 변경 완료

    private final ProjectService projectService;
    
    /// | 프로젝트 등록 | <br/>
    /// <b>회사</b>가 프로젝트를 등록
    // {"pname" : "테스트 [백엔드]", "pintro" : "테스트 소개", "ptype" : 1, "pcomment" : "테스트 상세 설명", "pcount" : 4, "pstart" : "2025-04-21T13:00:00", "pend" : "2025-05-20T13:00:00", "recruit_pstart" : "2025-06-15T13:00:00", "recruit_pend" : "2025-12-12T13:00:00", "ppay" : 2700}
    @PostMapping("")
    public ResponseEntity<Boolean> writeProject(@RequestHeader("Authorization") String token, @RequestBody() ProjectDto projectDto) {
        System.out.println("ProjectController.writeProject");
        System.out.println("token = " + token + "\nprojectDto = " + projectDto);
        boolean result = projectService.writeProject(token, projectDto);
        if(!result) { return ResponseEntity.status(404).body(false); }
        return ResponseEntity.status(201).body(true);
    }
    
    /// | 프로젝트 전체조회 | <br/>
    /// ● 모든 프로젝트를 조회
    // http://localhost:8080/api/project/all?pno=1
    @GetMapping("")
    public ResponseEntity<List<ProjectDto>> findAllProject() {
        System.out.println("ProjectController.findAllProject");
        List<ProjectDto> result = projectService.findAllProject();
        if(result == null || result.isEmpty()) { return ResponseEntity.status(404).body(null); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 전체조회 - 회사 | <br/>
    /// ● 모든 프로젝트를 조회
    // http://localhost:8080/api/project/c-all?pno=1
    @GetMapping("")
    public ResponseEntity<List<ProjectDto>> findAllProjectCompany() {
        System.out.println("ProjectController.findAllProjectCompany");
        List<ProjectDto> result = projectService.findAllProject();
        if(result == null || result.isEmpty()) { return ResponseEntity.status(404).body(null); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 상세조회 - 개발자 | <br/>
    /// ● <b>개발자</b>가 공고를 선택 시 공고 상세보기
    // http://localhost:8080/api/project/d-detail?pno=1
    @GetMapping("/d_detail")
    public ResponseEntity<ProjectDto> findProjectDev(@RequestHeader("Authorization") String token, @RequestParam(name = "pno") int pno) {
        System.out.println("ProjectController.findProjectDev");
        System.out.println("token = \n" + token + "\npno = " + pno);
        ProjectDto result = projectService.findProjectDev(token, pno);
        if(result == null) { return ResponseEntity.status(404).body(null); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 상세조회 - 회사 | <br/>
    /// ● <b>회사</b>가 공고를 선택 시 공고 상세보기
    // http://localhost:8080/api/project/c-detail?pno=1
    @GetMapping("/c_detail")
    public ResponseEntity<ProjectDto> findProjectCompany(@RequestHeader("Authorization") String token, @RequestParam(name = "pno") int pno) {
        System.out.println("ProjectController.findProjectCompany");
        System.out.println("token = \n" + token + "\npno = " + pno);
        ProjectDto result = projectService.findProjectCompany(token, pno);
        if(result == null) { return ResponseEntity.status(404).body(null); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 상세조회 - 관리자 | <br/>
    /// ● <b>관리자</b>가 공고를 선택 시 공고 상세보기
    // http://localhost:8080/api/project/a-detail?pno=1
    @GetMapping("/c_detail")
    public ResponseEntity<ProjectDto> findProjectAdmin(@RequestHeader("Authorization") String token, @RequestParam(name = "pno") int pno) {
        System.out.println("ProjectController.findProjectAdmin");
        System.out.println("token = \n" + token + "\npno = " + pno);
        ProjectDto result = projectService.findProjectAdmin(token, pno);
        if(result == null) { return ResponseEntity.status(404).body(null); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 수정 | <br/>
    /// ● <b>회사</b>가 프로젝트 수정
    // {"pno" : 1, "pname" : "수정 테스트 [백엔드]", "pintro" : "수정 테스트 소개", "ptype" : 1, "pcomment" : "수정 테스트 상세 설명", "pcount" : 2, "pstart" : "2025-04-21T13:00:00", "pend" : "2025-05-20T13:00:00", "recruit_pstart" : "2025-06-15T13:00:00", "recruit_pend" : "2025-12-12T13:00:00", "ppay" : 3200}
    @PutMapping("")
    public ResponseEntity<Boolean> updateProject(@RequestHeader("Authorization") String token, @RequestBody() ProjectDto projectDto) {
        System.out.println("ProjectController.updateProject");
        System.out.println("projectDto = " + projectDto);
        boolean result = projectService.updateProject(token, projectDto);
        if(!result) { return ResponseEntity.status(404).body(false); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 삭제 | <br/>
    /// ● <b>회사</b>가 프로젝트를 삭제
    // http://localhost:8080/api/project?pno=1
    @DeleteMapping("")
    public ResponseEntity<Boolean> deleteProject(@RequestHeader("Authorization") String token, @RequestParam(name = "pno") int pno) {
        System.out.println("ProjectController.deleteProject");
        System.out.println("token = \n" + token + "\npno = " + pno);
        boolean result = projectService.deleteProject(token, pno);
        if(!result) { return ResponseEntity.status(404).body(false); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 삭제 | <br/>
    /// ● <b>관리자</b>가 프로젝트를 삭제

}
