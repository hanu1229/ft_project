package devconnect.controller;

import devconnect.model.dto.ProjectDto;
import devconnect.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<Integer> writeProject(@RequestHeader("Authorization") String token, @ModelAttribute() ProjectDto projectDto) {
        System.out.println("ProjectController.writeProject");
        System.out.println("token = " + token + "\nprojectDto = " + projectDto);
        int pno = projectService.writeProject(token, projectDto);
        if( pno < 0 ) { return ResponseEntity.status(404).body( 0 ); }
        return ResponseEntity.status(201).body( pno );
    }
    
    /// | 프로젝트 전체조회 | <br/>
    /// ● 모든 프로젝트를 조회
    // http://localhost:8080/api/project/all
    @GetMapping("")
    public ResponseEntity<List<ProjectDto>> findAllProject() {
        System.out.println("ProjectController.findAllProject");
        List<ProjectDto> result = projectService.findAllProject();
        if(result == null || result.isEmpty()) { return ResponseEntity.status(404).body(null); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 전체조회 - 기업 | <br/>
    /// ● 기업의 모든 프로젝트를 조회
    // http://localhost:8080/api/project/company
    @GetMapping("/company")
    public ResponseEntity<List<ProjectDto>> findAllProject(@RequestHeader("Authorization") String token) {
        System.out.println("ProjectController.findAllProject");
        System.out.println("token = \n" + token);
        List<ProjectDto> result = projectService.findAllProject(token);
        if(result == null || result.isEmpty()) { return ResponseEntity.status(404).body(null); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 전체조회 - 페이징 | <br/>
    /// ● 모든 프로젝트를 조회
    // http://localhost:8080/api/project/paging
    @GetMapping("/paging")
    public ResponseEntity<List<ProjectDto>> findPagingProject(
            @RequestParam(name = "ptype", defaultValue = "0") int ptype,
            @RequestParam(name = "rstatus", defaultValue = "0") int recruitment_status,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "5") int size
    ) {
        System.out.println("ProjectController.findPagingProject");
        System.out.println("ptype = " + ptype + " ,recruitment_status = " + recruitment_status + ", page = " + page + ", size = " + size);

        List<ProjectDto> result = projectService.findPagingProject(ptype, recruitment_status, page, size);
        if(result == null || result.isEmpty()) { return ResponseEntity.status(404).body(null); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 상세조회 | <br/>
    /// ● <b>개발자</b>가 공고를 선택 시 공고 상세보기
    // http://localhost:8080/api/project/detail?pno=1
    @GetMapping("/detail")
    public ResponseEntity<ProjectDto> findProject(@RequestHeader("Authorization") String token, @RequestParam(name = "pno") int pno) {
        System.out.println("ProjectController.findProject");
        System.out.println("token = \n" + token + "\npno = " + pno);
        ProjectDto result = projectService.findProject(token, pno);
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

}
