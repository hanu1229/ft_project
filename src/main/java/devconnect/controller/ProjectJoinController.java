package devconnect.controller;

import devconnect.model.dto.ProjectJoinDto;
import devconnect.service.ProjectJoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/project_join")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProjectJoinController {

    private final ProjectJoinService projectJoinService;

    /// 프로젝트 신청 등록
     @PostMapping("")
     public ResponseEntity<Boolean> writeProjectJoin(@RequestHeader("Authorization") String token, @RequestBody() ProjectJoinDto projectJoinDto) {
         System.out.println("ProjectJoinController.writeProjectJoin");
         System.out.println("token = \n" + token + "\nprojectJoinDto = " + projectJoinDto);
         boolean result = projectJoinService.writeProjectJoin(token, projectJoinDto);
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

    /// 프로젝트 신청 수정


    /// 프로젝트 신청 삭제


}
