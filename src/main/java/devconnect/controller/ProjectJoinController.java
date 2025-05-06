package devconnect.controller;

import devconnect.model.dto.ProjectDto;
import devconnect.model.dto.ProjectJoinDto;
import devconnect.service.DeveloperService;
import devconnect.service.ProjectJoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/project-join")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProjectJoinController {

    private final ProjectJoinService projectJoinService;
    private final DeveloperService developerService;

    /// | 프로젝트 신청 등록 | <br/>
    /// ● <b>개발자</b>가 프로젝트에 참가를 신청
     @PostMapping("")
     public ResponseEntity<Boolean> writeProjectJoin(@RequestHeader("Authorization") String token, @RequestParam(name = "pno") int pno) {
         System.out.println("ProjectJoinController.writeProjectJoin");
         System.out.println("token = \n" + token + "\npno = " + pno);
         boolean result = projectJoinService.writeProjectJoin(token, pno);
         if(!result) { return ResponseEntity.status(400).body(false); }
         return ResponseEntity.status(201).body(true);
     }

    /// | 프로젝트 신청 개별 조회 | <br/>
    /// ● <b>회사</b>가 자신의 공고를 선택하면 개발자들이 신청한 신청을 출력하는 함수
    @GetMapping("")
    public ResponseEntity<List<ProjectJoinDto>> findProjectJoin(@RequestHeader("Authorization") String token, @RequestParam(name = "pno") int pno) {
        System.out.println("ProjectJoinController.findProjectJoin");
        System.out.println("token = \n" + token + "\npno = " + pno);
        List<ProjectJoinDto> result = projectJoinService.findProjectJoin(token, pno);
        if(result == null || result.isEmpty()) { return ResponseEntity.status(404).body(result); }
        return ResponseEntity.status(200).body(result);
    }

    ///  | 프로젝트 신청 전체조회 - 페이징 | <br/>
    ///  ● 한 프로젝트의 모든 신청을 페이징으로 조회
    // http://localhost:8080/api/project-join/paging
    @GetMapping("/paging")
    public ResponseEntity<Page<ProjectJoinDto>> findPagingProjectJoin(
            @RequestHeader("Authorization") String token, @RequestParam(name = "pno") int pno,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size
    ) {
        System.out.println("ProjectJoinController.findPagingProjectJoin");
        System.out.println("token = \n" + token + "\npno = " + pno + ", page = " + page + ", size = " + size);
        Pageable pageable = PageRequest.of(page, size);
        Page<ProjectJoinDto> result = projectJoinService.findPagingProjectJoin(token, pno, pageable);
        if(result == null || result.isEmpty()) { return ResponseEntity.status(404).body(null); }
        return ResponseEntity.status(200).body(result);
    }

    /// | 프로젝트 신청 수정 | <br/>
    /// ● <b>회사</b>가 개발자의 신청을 수락 또는 거절
    @PutMapping("")
    public ResponseEntity<Boolean> updateProjectJoin(@RequestHeader("Authorization") String token, @RequestBody() ProjectJoinDto projectJoinDto) {
        System.out.println("ProjectJoinController.updateProjectJoin");
        System.out.println("projectJoinDto = " + projectJoinDto + "\ntoken = " + token);
        boolean result = projectJoinService.updateProjectJoin(token, projectJoinDto);
        if(!result) { return ResponseEntity.status(400).body(false); }
        return ResponseEntity.status(200).body(true);
    }


    /// | 프로젝트 신청 삭제 | <br/>
    /// ● <b>관리자</b>가 개발자의 신청을 삭제
    @DeleteMapping("")
    public ResponseEntity<Boolean> deleteProjectJoin(@RequestHeader("Authorization") String token, @RequestParam(name = "pjno") int pjno) {
        System.out.println("ProjectJoinController.deleteProjectJoin");
        System.out.println("pjno = " + pjno + "\ntoken = " + token);
        boolean result = projectJoinService.deleteProjectJoin(token, pjno);
        if(!result) { return ResponseEntity.status(400).body(false); }
        return ResponseEntity.status(200).body(true);
    }

    /* 희만 코드 추가 */
    // 로그인한 회원 전체 조회
    @GetMapping("/findall")
    public ResponseEntity< Page<ProjectJoinDto> > findByDno(
            @RequestHeader("Authorization") String token,
            @RequestParam( required = false ) Integer pno,
            @RequestParam( defaultValue = "1") int page,
            @RequestParam( defaultValue = "5") int size,
            @RequestParam( required = false ) String keyword ) {
        System.out.println("ProjectJoinController.findProjectJoin");
        System.out.println("token = \n" + token + "\npno = " + pno);

        int logInDno;
        try{
            logInDno = developerService.info( token ).getDno();
        }catch ( Exception e ){ return ResponseEntity.status(401).body(null); }

        Page<ProjectJoinDto> result = projectJoinService.findByDno( logInDno, pno, page, size, keyword );
        return ResponseEntity.status(200).body(result);
    }

}
