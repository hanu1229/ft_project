package devconnect.service;

import devconnect.model.dto.ProjectDto;
import devconnect.model.dto.ProjectJoinDto;
import devconnect.model.entity.*;
import devconnect.model.repository.*;
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;


import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProjectJoinService {

    private final ProjectJoinRepository projectJoinRepository;
    private final ProjectRepository projectRepository;
    private final CompanyRepository companyRepository;
    private final DeveloperRepository developerRepository;
    private final AdminEntityRepository adminRepository;
    private final DratingRepository dratingRepository;
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

    /// | 프로젝트 신청 등록 | <br/>
    /// ● <b>개발자</b>가 프로젝트에 참가를 신청
    public boolean writeProjectJoin(String token, int pno) {
        System.out.println("ProjectJoinService.writeProjectJoin");
        System.out.println("token = \n" + token + "\npno = " + pno);
        String id = jwtutil.valnoateToken(token);
        String code = jwtutil.returnCode(id);
        if(!code.equals("Developer")) { return false; }
        DeveloperEntity developerEntity = developerRepository.findByDid(id);
        // DeveloperEntity developerEntity = tokenToDeveloperEntity(token);
        if(developerEntity == null) { return false; }
        ProjectEntity projectEntity = projectRepository.findById(pno).orElse(null);
        if(projectEntity == null) { return false; }
        ProjectJoinEntity projectJoinEntity = new ProjectJoinEntity();
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
        System.out.println(">> 회사 정보 가져옴");
        ProjectEntity projectEntity = projectRepository.findById(pno).orElse(null);
        if(projectEntity == null) { return null; }
        System.out.println(">> 프로젝트 번호 가져옴");
        List<ProjectJoinEntity> projectJoinEntityList = projectJoinRepository.findByProjectEntity(projectEntity);
        if(projectJoinEntityList.isEmpty()) { return null; }
        System.out.println(">> 프로젝트 정보 가져옴");
        System.out.println(">> projectJoinEntityList : \n" + projectJoinEntityList);
        List<ProjectJoinDto> projectJoinDtoList = new ArrayList<>();
        System.out.println(">> for문 시작");
        for(int index = 0; index < projectJoinEntityList.size(); index++) {
            System.out.println(">> for문 " + index);
            ProjectJoinEntity projectJoinEntity = projectJoinEntityList.get(index);
            ProjectJoinDto projectJoinDto = projectJoinEntity.toDto();
            projectJoinDtoList.add(projectJoinDto);
        }
        System.out.println(">> for문 끝");
        return projectJoinDtoList;
    }

    ///  | 프로젝트 신청 전체조회 - 페이징 | <br/>
    ///  ● 한 프로젝트의 모든 신청을 페이징으로 조회
    public Page<ProjectJoinDto> findPagingProjectJoin(String token, int pno, Pageable pageable) {
        System.out.println("ProjectJoinService.findPagingProjectJoin");
        System.out.println("token = \n" + token + "\npno = " + pno + ", pageable = " + pageable);
        String id = jwtutil.valnoateToken(token);
        String code = jwtutil.returnCode(id);
        if(!code.equals("Company")) { return null; }
        ProjectEntity projectEntity = projectRepository.findById(pno).orElse(null);
        if(projectEntity == null) { return null; }
        Page<ProjectJoinEntity> projectJoinEntityPageList = projectJoinRepository.findByPnoJoin(pno, pageable);
        List<ProjectJoinEntity> projectJoinEntityList = projectJoinEntityPageList.getContent();
        int totalPages = projectJoinEntityPageList.getTotalPages();
        long totalData = projectJoinEntityPageList.getTotalElements();
        System.out.println("totalPages = " + totalPages + ", totalData = " + totalData);
        List<ProjectJoinDto> projectJoinDtoList = new ArrayList<>();
        if(!projectJoinEntityList.isEmpty()) {
            for(int index = 0; index < projectJoinEntityList.size(); index++) {
                ProjectJoinEntity projectJoinEntity = projectJoinEntityList.get(index);
                // double avg = dratingRepository.findByAvgDno(projectJoinEntity.getDeveloperEntity().getDno());
                ProjectJoinDto projectJoinDto = projectJoinEntity.toDto();
                // projectJoinDto.setDavg(avg);
                projectJoinDtoList.add(projectJoinDto);
            }
        }
        Page<ProjectJoinDto> projectJoinDtoPage = new PageImpl<>(projectJoinDtoList, projectJoinEntityPageList.getPageable(), totalData);
        return projectJoinDtoPage;
    }

    /// | 프로젝트 신청 수정 | <br/>
    /// ● <b>회사</b>가 개발자의 신청을 수락 또는 거절
    public boolean updateProjectJoin(String token, ProjectJoinDto projectJoinDto) {
        System.out.println("ProjectJoinService.updateProjectJoin");
        System.out.println("projectJoinDto = " + projectJoinDto + "\ntoken = " + token);
        String id = jwtutil.valnoateToken(token);
        CompanyEntity companyEntity = companyRepository.findByCid(id);
        if(companyEntity == null) { return false; }
        ProjectJoinEntity projectJoinEntity = projectJoinRepository.findById(projectJoinDto.getPjno()).orElse(null);
        if(projectJoinEntity == null) { return false; }
        // 0 : 대기 | 1 : 수락 | 2 : 거절
        if(projectJoinEntity.getPjtype() > 0) { return false; }
        projectJoinEntity.setPjtype(projectJoinDto.getPjtype());
        return true;
    }

    /// | 프로젝트 신청 삭제 | <br/>
    /// ● <b>관리자</b>가 개발자의 신청을 삭제
    public boolean deleteProjectJoin( String token, int pjno) {
        System.out.println("ProjectJoinService.deleteProjectJoin");
        System.out.println("pjno = " + pjno + "\ntoken = " + token);
        String id = jwtutil.valnoateToken(token);
        AdminEntity adminEntity = adminRepository.findByAdid(id).orElse(null);
        if(adminEntity == null) { return false; }
        ProjectJoinEntity projectJoinEntity = projectJoinRepository.findById(pjno).orElse(null);
        if(projectJoinEntity == null) { return false; }
        projectJoinRepository.deleteById(pjno);
        return true;
    }

    /* 희만 코드 추가 */
    // 로그인한 회원 전체 조회
    public Page<ProjectJoinDto> findByDno(
            int logInDno, Integer pno, int page, int size, String keyword ){
        System.out.println("ProjectJoinService.findByDno");
        System.out.println("logInDno = " + logInDno + ", pno = " + pno + ", page = " + page + ", size = " + size + ", keyword = " + keyword );

        Pageable pageable = PageRequest.of( page-1, size, Sort.by(Sort.Direction.DESC, "pjno") );

        Page< ProjectJoinEntity > projectJoinEntities = projectJoinRepository.findBySearch( logInDno, keyword, pageable );

        Page< ProjectJoinDto > projectJoinDtoList = projectJoinEntities.map( ProjectJoinEntity::toFindAllDto );
        return projectJoinDtoList;
    }

    // 05-08 이민진 코드 추가
    // 프로젝트에 참여한 개발자 조회(기업입장)
    public List<Integer> getDno( int pno ){
        System.out.println("ProjectJoinService.getDno");
        if( projectRepository.existsById(pno) ){
            return projectJoinRepository.findDnoByPno( pno );
        }else{ return null; } // if end
    } // f end

    // 05-11 이민진 코드 추가
    // 프로젝트에 참여한 개발자 조회(기업입장)
    public Integer getCno( int pno ){
        System.out.println("ProjectJoinService.getCno");
        System.out.println("pno = " + pno);
        if( projectRepository.existsById(pno)){
            return projectJoinRepository.findCnoByPno( pno );
        }else{
            return null;
        } // if end
    } // f end

}
