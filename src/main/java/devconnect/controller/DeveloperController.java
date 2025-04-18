package devconnect.controller;

import devconnect.service.DeveloperService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/developer")
@RequiredArgsConstructor
public class DeveloperController {
    private final DeveloperService developerService;

}
