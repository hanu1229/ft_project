package devconnect.controller;

import devconnect.service.ProjectJoinService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/project_join")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProjectJoinController {

    private final ProjectJoinService projectJoinService;

}
