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
    
    /// 토큰에 존재하는 데이터를 이용하여 엔티티를 반환하는 함수 <br/>
    /// 테이블에 값이 없을 경우 null을 리턴
    public CompanyEntity tokenToCompanyEntity(String token) {
        String cid = jwtUtil.valnoateToken(token);
        System.out.println("cid = " + cid);
        CompanyEntity companyEntity = companyRepository.findByCid(cid);
        if(companyEntity == null) {
            System.out.println("companyEntity = null");
            return null;
        }
        System.out.println("companyEntity = " + companyEntity);
        return companyEntity;
    }
    

    /// ● 프로젝트 등록
    public boolean writeProject(String token, ProjectDto projectDto) {
        System.out.println("ProjectService.writeProject");
        System.out.println("token = " + token + "\nprojectDto = " + projectDto);
        // 토큰의 데이터에 있는 회사가 있는지 확인하는 부분
        CompanyEntity companyEntity = tokenToCompanyEntity(token);
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

    /// ● 프로젝트 상세조회
    public ProjectDto findProject(String token, int pno) {
        System.out.println("ProjectService.findProject");
        System.out.println("pno = " + pno + ", token = \n" + token);
        // 토큰의 데이터에 있는 회사가 있는지 확인하는 부분
        CompanyEntity companyEntity = tokenToCompanyEntity(token);
        if(companyEntity == null) { return null; }
        Optional<ProjectEntity> optional = projectRepository.findById(pno);
        if(optional.isPresent()) {
            ProjectDto projectDto = optional.get().toDto();
            System.out.println("projectDto = " + projectDto);
            return projectDto;
        }
        return null;
    }

    /// ● 프로젝트 수정
    public boolean updateProject(String token, ProjectDto projectDto) {
        System.out.println("ProjectService.updateProject");
        System.out.println("token = \n" + token + "\nprojectDto = " + projectDto);
        // 토큰의 데이터에 있는 회사가 있는지 확인하는 부분
        CompanyEntity companyEntity = tokenToCompanyEntity(token);
        if(companyEntity == null) { return false; }
        Optional<ProjectEntity> optional = projectRepository.findById(projectDto.getPno());
        if(optional.isPresent()) {
            ProjectEntity projectEntity = optional.get();
            if(companyEntity.getCno() == projectEntity.getCompanyEntity().getCno()) {
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
        }
        return false;
    }

    /// ● 프로젝트 삭제
    public boolean deleteProject(String token, int pno) {
        System.out.println("ProjectService.deleteProject");
        System.out.println("token = \n" + token + "\npno = " + pno);
        // 토큰의 데이터에 있는 회사가 있는지 확인하는 부분
        CompanyEntity companyEntity = tokenToCompanyEntity(token);
        if(companyEntity == null) { return false; }
        Optional<ProjectEntity> optional = projectRepository.findById(pno);
        if(optional.isPresent()) {
            ProjectEntity projectEntity = optional.get();
            if(companyEntity.getCno() == projectEntity.getCompanyEntity().getCno()) {
                projectRepository.deleteById(pno);
                return true;
            }
        }
        return false;
    }

}
