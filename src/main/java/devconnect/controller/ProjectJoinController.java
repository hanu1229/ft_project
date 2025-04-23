package devconnect.controller;

import devconnect.service.ProjectJoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/project_join")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProjectJoinController {

    private final ProjectJoinService projectJoinService;

    /// 프로젝트 신청 등록
//    @PostMapping("")
//    public boolean

    /// 프로젝트 신청 조회


    /// 프로젝트 신청 수정


    /// 프로젝트 신청 삭제


}
