package devconnect.service;

import devconnect.model.dto.ProjectDto;
import devconnect.model.entity.CompanyEntity;
import devconnect.model.entity.ProjectEntity;
import devconnect.model.repository.CompanyRepository;
import devconnect.model.repository.ProjectRepository;
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectService {

    // 추후 토큰으로 변경

    private final ProjectRepository projectRepository;
    private final CompanyRepository companyRepository;
    private final JwtUtil jwtUtil;

    /// ● 프로젝트 등록
    public boolean writeProject(String token, ProjectDto projectDto) {
        System.out.println("ProjectService.writeProject");
        System.out.println("token = " + token + "\nprojectDto = " + projectDto);
        String cid = jwtUtil.valnoateToken(token);
        System.out.println("cid = " + cid);
        CompanyEntity companyEntity = companyRepository.findByCid(cid);
        System.out.println("companyEntity = " + companyEntity);
        if(companyEntity != null) {
            projectDto.setCno(companyEntity.getCno());
            System.out.println("projectDto = " + projectDto);
            ProjectEntity projectEntity = projectRepository.save(projectDto.toEntity());
            if(projectEntity.getPno() > 0) {
                // FK값을 넣을 때는 FK의 엔티티 자체를 넣으면 됨
                projectEntity.setCompanyEntity( companyEntity );
                return true;
            }
        }
        return false;
    }

    /// ● 프로젝트 조회
    public List<ProjectDto> findAllProject() {
        System.out.println("ProjectService.findAllProject");
        List<ProjectEntity> projectEntityList = projectRepository.findAll();
        List<ProjectDto> projectDtoList = new ArrayList<>();
        if(!projectEntityList.isEmpty()) {
            for(int index = 0; index < projectEntityList.size(); index++) {
                ProjectEntity projectEntity = projectEntityList.get(index);
                ProjectDto projectDto = projectEntity.toDto();
                projectDto.setCno(projectEntity.getCompanyEntity().getCno());
                projectDtoList.add(projectDto);
            }
        }
        return projectDtoList;
    }

    /// ● 프로젝트 수정
    // {"pno" : 1, "pname" : "수정 테스트 [백엔드]", "pintro" : "수정 테스트 소개", "ptype" : 1, "pcomment" : "수정 테스트 상세 설명", "pcount" : 2, "pstart" : "2025-04-21T13:00:00", "pend" : "2025-05-20T13:00:00", "recruit_pstart" : "2025-06-15T13:00:00", "recruit_pend" : "2025-12-12T13:00:00", "ppay" : 3200}
    public boolean updateProject(ProjectDto projectDto) {
        System.out.println("ProjectService.updateProject");
        System.out.println("projectDto = " + projectDto);
        Optional<ProjectEntity> optional = projectRepository.findById(projectDto.getPno());
        if(optional.isPresent()) {
            ProjectEntity projectEntity = optional.get();
            if(!projectEntity.getPname().equals(projectDto.getPname())) { projectEntity.setPname(projectDto.getPname()); }
            if(!projectEntity.getPintro().equals(projectDto.getPintro())) { projectEntity.setPintro(projectDto.getPintro()); }
            if(!projectEntity.getPcomment().equals(projectDto.getPcomment())) { projectEntity.setPcomment(projectDto.getPcomment()); }
            if(!projectEntity.getPstart().equals(projectDto.getPstart())) { projectEntity.setPstart(projectDto.getPstart()); }
            if(!projectEntity.getPend().equals(projectDto.getPend())) { projectEntity.setPend(projectDto.getPend()); }
            if(!projectEntity.getRecruit_pstart().equals(projectDto.getRecruit_pstart())) { projectEntity.setRecruit_pstart(projectDto.getRecruit_pstart()); }
            if(!projectEntity.getRecruit_pend().equals(projectDto.getRecruit_pend())) { projectEntity.setRecruit_pend(projectDto.getRecruit_pend()); }
            if(projectEntity.getPtype() != projectDto.getPtype()) { projectEntity.setPtype(projectDto.getPtype()); }
            if(projectEntity.getPcount() != projectDto.getPcount()) { projectEntity.setPcount(projectDto.getPcount()); }
            if(projectEntity.getPpay() != projectDto.getPpay()) { projectEntity.setPpay(projectDto.getPpay()); }
            return true;
        }
        return false;
    }

    /// ● 프로젝트 삭제
    public boolean deleteProject(int pno) {
        System.out.println("ProjectService.deleteProject");
        System.out.println("pno = " + pno);
        Optional<ProjectEntity> optional = projectRepository.findById(pno);
        if(optional.isPresent()) {
            ProjectEntity projectEntity = optional.get();
            projectRepository.deleteById(pno);
            return true;
        }
        return false;
    }

}
