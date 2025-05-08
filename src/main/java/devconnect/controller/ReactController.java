package devconnect.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class ReactController {
    @RequestMapping(value = {
            "/", // 루트 경로는 항상 index.html로
            // 필수적인 제외: API, 주요 정적 리소스 폴더명, 일반 파일 확장자 형태
            "/{path:^(?!api|static|assets|images|js|css|.*\\..{2,5}$).*}/**"
    })
    public String index( ) {
        return "forward:/index.html";
    }
}
