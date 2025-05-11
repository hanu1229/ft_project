package devconnect.controller;

import devconnect.model.dto.TechStack.ProjectTechStackViewDto;
import devconnect.model.dto.TechStack.ProjectTechStackWriteDto;
import devconnect.model.dto.TechStack.TechStackListViewDto;
import devconnect.service.CompanyService;
import devconnect.service.DeveloperService;
import devconnect.service.ProjectTechStackService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projecttechstack")
@RequiredArgsConstructor
@CrossOrigin("*")
public class ProjectTechStackController {
    private final ProjectTechStackService projectTechStackService;
    private final CompanyService companyService;

    // 1. 프로젝트 기술 스택 등록
    @PostMapping
    public ResponseEntity< Boolean > onWrite(
            @RequestHeader("Authorization") String token,
            @RequestBody ProjectTechStackWriteDto projectTechStackWriteDto ){
        int logInCno = 0;
        try{ logInCno = companyService.info( token ).getCno();
        }catch (Exception e){ return ResponseEntity.status( 401 ).body( false ); }

        if( projectTechStackWriteDto.getPtsno() != null ){
            projectTechStackService.onDelete( projectTechStackWriteDto.getPno() );
        }

        boolean result = projectTechStackService.onWrite( projectTechStackWriteDto, logInCno );
        if( result ){ return ResponseEntity.status( 200 ).body( true ); }
        else{ return ResponseEntity.status( 400 ).body( false ); }

    } // f end

    // 2. 프로젝트 기술 스택 조회
    @GetMapping("/findall")
    public ResponseEntity< List<ProjectTechStackViewDto> > findByPno( @RequestParam int pno ){
        List<ProjectTechStackViewDto> result = projectTechStackService.findByPno( pno );
        return ResponseEntity.status( 200 ).body( result );
    }

}
