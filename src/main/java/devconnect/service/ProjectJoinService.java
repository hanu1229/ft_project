package devconnect.service;

import devconnect.model.dto.ProjectJoinDto;
import devconnect.model.entity.CompanyEntity;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.entity.ProjectEntity;
import devconnect.model.entity.ProjectJoinEntity;
import devconnect.model.repository.CompanyRepository;
import devconnect.model.repository.DeveloperRepository;
import devconnect.model.repository.ProjectJoinRepository;
import devconnect.model.repository.ProjectRepository;
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectJoinService {

    private final ProjectJoinRepository projectJoinRepository;
    private final ProjectRepository projectRepository;
    private final CompanyRepository companyRepository;
    private final DeveloperRepository developerRepository;
    private final JwtUtil jwtutil;

    /// 토큰에 존재하는 데이터를 이용하여 엔티티를 반환하는 함수 <br/>
    /// 테이블에 값이 없을 경우 null을 리턴
    public CompanyEntity tokenToCompanyEntity(String token) {
        String cid = jwtutil.valnoateToken(token);
        System.out.println("cid = " + cid);
        CompanyEntity companyEntity = companyRepository.findByCid(cid);
        if(companyEntity == null) {
            System.out.println("companyEntity = null");
            return null;
        }
        System.out.println("companyEntity = " + companyEntity);
        return companyEntity;
    }

    /// 토큰에 존재하는 데이터를 이용하여 엔티티를 반환하는 함수 <br/>
    /// 테이블에 값이 없을 경우 null을 리턴
    public DeveloperEntity tokenToDeveloperEntity(String token) {
        String did = jwtutil.valnoateToken(token);
        System.out.println("did = " + did);
        DeveloperEntity developerEntity = developerRepository.findByDid(did);
        if(developerEntity == null) {
            System.out.println("developerEntity = null");
            return null;
        }
        System.out.println("developerEntity = " + developerEntity);
        return developerEntity;
    }

    /// 프로젝트 신청 등록
    public boolean writeProjectJoin(String token, ProjectJoinDto projectJoinDto) {
        System.out.println("ProjectJoinService.writeProjectJoin");
        System.out.println("token = \n" + token + "\nprojectJoinDto = " + projectJoinDto);
        DeveloperEntity developerEntity = tokenToDeveloperEntity(token);
        if(developerEntity == null) { return false; }
        ProjectEntity projectEntity = projectRepository.findById(projectJoinDto.getPno()).orElse(null);
        if(projectEntity == null) { return false; }
        ProjectJoinEntity projectJoinEntity = projectJoinDto.toEntity();
        projectJoinEntity.setProjectEntity(projectEntity);
        projectJoinEntity.setDeveloperEntity(developerEntity);
        ProjectJoinEntity joinEntity = projectJoinRepository.save(projectJoinEntity);
        return joinEntity.getPjno() > 0;
    }

    /// | 프로젝트 신청 개별 조회 | <br/>
    /// ● <b>회사</b>가 자신의 공고를 선택하면 개발자들이 신청한 신청을 출력하는 함수
    public List<ProjectJoinDto> findProjectJoin(String token, int pno) {
        System.out.println("ProjectJoinService.findProjectJoin");
        System.out.println("token = \n" + token + "\npno = " + pno);

        CompanyEntity companyEntity = tokenToCompanyEntity(token);
        if(companyEntity == null) { return null; }
        ProjectEntity projectEntity = projectRepository.findById(pno).orElse(null);
        if(projectEntity == null) { return null; }
        return null;

    }

    /// 프로젝트 신청 수정


    /// 프로젝트 신청 삭제


}
