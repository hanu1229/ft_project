package devconnect.service;

import devconnect.model.dto.ProjectDto;
import devconnect.model.entity.AdminEntity;
import devconnect.model.entity.CompanyEntity;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.entity.ProjectEntity;
import devconnect.model.entity.ProjectImageEntity;
import devconnect.model.repository.AdminEntityRepository;
import devconnect.model.repository.CompanyRepository;
import devconnect.model.repository.DeveloperRepository;
import devconnect.model.repository.ProjectImageRepository;
import devconnect.model.repository.ProjectRepository;
import devconnect.util.FileUtil;
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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
    private final ProjectImageRepository projectImageRepository;
    private final JwtUtil jwtUtil;
    private final FileUtil fileUtil;

    private final DeveloperRepository developerRepository;
    private final AdminEntityRepository adminRepository;

    /// | 프로젝트 등록 | <br/>
    /// <b>회사</b>가 프로젝트를 등록<br/>
    public int writeProject(String token, ProjectDto projectDto) {
        System.out.println("ProjectService.writeProject");
        System.out.println("token = " + token + "\nprojectDto = " + projectDto);
        // 토큰의 데이터에 있는 회사가 있는지 확인하는 부분
        String id = jwtUtil.valnoateToken(token);
        CompanyEntity companyEntity = companyRepository.findByCid(id);
        if(companyEntity != null) {
            projectDto.setCno(companyEntity.getCno());
            System.out.println("projectDto = " + projectDto);
            ProjectEntity projectEntity = projectRepository.save(projectDto.toEntity());
            if(projectEntity.getPno() > 0) {
                // FK값을 넣을 때는 FK의 엔티티 자체를 넣으면 됨
                projectEntity.setCompanyEntity( companyEntity );
                 if(projectDto.getFiles() != null && !projectDto.getFiles().isEmpty()) {
                     // 여러개의 첨부파일이므로 반복문 사용
                     for(MultipartFile file : projectDto.getFiles()) {
                         // FileUtil에서 업로드 메소드 호출
                         String saveFileName = fileUtil.fileUpload(file);
                         // 만약에 업로드를 실패하면 트랜잭션 롤백 | 강제 예외 발생
                         if(saveFileName == null) { throw new RuntimeException("이미지 업로드 오류 발생"); }
                         // 업로드 성공했으면 ProjectImageEntity 만들기
                         ProjectImageEntity projectImageEntity = ProjectImageEntity.builder().iname(saveFileName).build();
                         // 단방향 관계(FK) 주입 | pno가 아닌 projectEntity
                         projectImageEntity.setProjectEntity(projectEntity);
                         // ProjectImageEntity 영속화
                         projectImageRepository.save(projectImageEntity);
                     }
                 }
                return projectEntity.getPno();
            }
        }
        return 0;
    }

    /// | 프로젝트 전체조회 | <br/>
    /// ● 모든 프로젝트를 조회
    public List<ProjectDto> findAllProject() {
        System.out.println("ProjectService.findAllProject");
        List<ProjectEntity> projectEntityList = projectRepository.findAll();
        List<ProjectDto> projectDtoList = new ArrayList<>();
        if(!projectEntityList.isEmpty()) {
            for(int index = 0; index < projectEntityList.size(); index++) {
                ProjectEntity projectEntity = projectEntityList.get(index);
                ProjectDto projectDto = projectEntity.toDto();
                projectDto.setCno(projectEntity.getCompanyEntity().getCno());
                // 추가
                projectDto.setCprofile(projectEntity.getCompanyEntity().getCprofile());
                System.out.println(">> \n" + projectDto.getCprofile() + "\n");
                projectDtoList.add(projectDto);
            }
        }
        return projectDtoList;
    }

    /// | 프로젝트 전체조회 - 기업 | <br/>
    /// ● 기업의 모든 프로젝트를 조회
    public List<ProjectDto> findAllProject(String token) {
        System.out.println("ProjectService.findAllProject");
        String id = jwtUtil.valnoateToken(token);
        CompanyEntity companyEntity = companyRepository.findByCid(id);
        if(companyEntity == null) { return null; }
        int cno = companyEntity.getCno();
        List<ProjectEntity> projectEntityList = projectRepository.findAllByCompanyEntity_cno(cno);
        List<ProjectDto> projectDtoList = new ArrayList<>();
        if(!projectEntityList.isEmpty()) {
            LocalDateTime today = LocalDateTime.now();
            for(int index = 0; index < projectEntityList.size(); index++) {
                ProjectEntity projectEntity = projectEntityList.get(index);
                ProjectDto projectDto = projectEntity.toDto();
                if(today.isAfter(projectDto.getRecruit_pstart())) {
                    projectDto.setRecruitment_status(2);
                }
                projectDto.setCno(projectEntity.getCompanyEntity().getCno());
                projectDtoList.add(projectDto);
            }
        }
        return projectDtoList;
    }

    /// | 프로젝트 전체조회 - 페이징 | <br/>
    /// ● 모든 프로젝트를 조회
    // http://localhost:8080/api/project/paging?ptype=0&page=0&size=0
    public List<ProjectDto> findPagingProject(int ptype, int recruitment_status, int page, int size) {
        System.out.println("ProjectService.findPagingProject");
        Page<ProjectEntity> projectEntityPageList;
        List<ProjectEntity> projectEntityList;
        Pageable pageable = PageRequest.of(page, size);
        // 현재 날짜 및 시간
        LocalDateTime ldt = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss");
        String today = ldt.format(formatter);
        String typeMsg = (ptype == 0) ?
                "직무 : 전체" : ptype == 1 ?
                "직무 : 백엔드" : ptype == 2 ?
                "직무 : 프론트엔드" : "직무 : 없음";
        if(recruitment_status == 0) {
            System.out.println(">> 모집기간 : 전체, " + typeMsg);
            projectEntityPageList = (ptype == 0) ?
                    projectRepository.findAll(pageable) : projectRepository.findByPtype(ptype, pageable);
        } else if(recruitment_status == 1) {
            System.out.println(">> 모집기간 : 모집 전, " + typeMsg);
            projectEntityPageList = (ptype == 0) ?
                    projectRepository.findByBefore(today, pageable) : projectRepository.findByBefore(ptype, today, pageable);
        } else if(recruitment_status == 2) {
            System.out.println(">> 모집기간 : 모집 중, " + typeMsg);
            projectEntityPageList = (ptype == 0) ?
                    projectRepository.findByIng(today, pageable) : projectRepository.findByIng(ptype, today, pageable);
        } else if(recruitment_status == 3) {
            System.out.println(">> 모집기간 : 모집 후, " + typeMsg);
            projectEntityPageList = (ptype == 0) ?
                    projectRepository.findByAfter(today, pageable) : projectRepository.findByAfter(ptype, today, pageable);
        } else {
            projectEntityPageList = null;
        }

        if(projectEntityPageList == null) { return null; }
        projectEntityList = projectEntityPageList.getContent();
        int totalPages = projectEntityPageList.getTotalPages();
        long totalData = projectEntityPageList.getTotalElements();
        System.out.println("totalPage = " + totalPages + ", totalData = " + totalData);
        List<ProjectDto> projectDtoList = new ArrayList<>();
        System.out.println(">> projectEntityList = " + projectEntityList);
        if(!projectEntityList.isEmpty()) {
            for(int index = 0; index < projectEntityList.size(); index++) {
                ProjectEntity projectEntity = projectEntityList.get(index);
                ProjectDto projectDto = projectEntity.toDto();
                projectDto.setCno(projectEntity.getCompanyEntity().getCno());
                projectDto.setCprofile(projectEntity.getCompanyEntity().getCprofile());
                //System.out.println(">> projectDto.getCprofile() = " + projectDto.getCprofile());
                projectDtoList.add(projectDto);
            }
        }
        return projectDtoList;
    }

    /// | 프로젝트 상세조회 | <br/>
    /// ● <b>개발자</b>가 공고를 선택 시 공고 상세보기
    public ProjectDto findProject(String token, int pno) {
        System.out.println("ProjectService.findProject");
        System.out.println("pno = " + pno + ", token = \n" + token);
        // 토큰의 데이터에 있는 회사가 있는지 확인하는 부분
        String id = jwtUtil.valnoateToken(token);
        String code = jwtUtil.returnCode(id);
        LocalDateTime today = LocalDateTime.now();
        if(code.equals("Company")) {
            Optional<ProjectEntity> optional = projectRepository.findById(pno);
            if(optional.isPresent()) {
                ProjectDto projectDto = optional.get().toDto();
                CompanyEntity companyEntity = companyRepository.findById(projectDto.getCno()).orElse(null);
                if(companyEntity == null) { return null; }
                projectDto.setCname(companyEntity.getCname());
                projectDto.setCprofile(companyEntity.getCprofile());
                System.out.println("projectDto = " + projectDto);
                return projectDto;
            }
        }
        else if(code.equals("Developer")) {
            Optional<ProjectEntity> optional = projectRepository.findById(pno);
            if(optional.isPresent()) {
                ProjectDto projectDto = optional.get().toDto();
                CompanyEntity companyEntity = companyRepository.findById(projectDto.getCno()).orElse(null);
                if(companyEntity == null) { return null; }
                projectDto.setCname(companyEntity.getCname());
                projectDto.setCprofile(companyEntity.getCprofile());

                if(today.isAfter(projectDto.getRecruit_pend())) {
                    projectDto.setRecruitment_status(3);
                }else if(!today.isBefore(projectDto.getRecruit_pstart()) &&
                        !today.isAfter(projectDto.getRecruit_pend())) {
                    projectDto.setRecruitment_status(2);
                } else if(today.isBefore(projectDto.getRecruit_pstart())) {
                    projectDto.setRecruitment_status(1);
                }
                System.out.println("projectDto = " + projectDto);
                return projectDto;
            }
        } else if(code.equals("Admin")) {
            Optional<ProjectEntity> optional = projectRepository.findById(pno);
            if(optional.isPresent()) {
                ProjectDto projectDto = optional.get().toDto();
                System.out.println("projectDto = " + projectDto);
                return projectDto;
            }
        }
        return null;
    }

    /// | 프로젝트 수정 | <br/>
    /// ● <b>회사</b>가 프로젝트 수정
    public boolean updateProject(String token, ProjectDto projectDto) {
        System.out.println("ProjectService.updateProject");
        System.out.println("token = \n" + token + "\nprojectDto = " + projectDto);
        // 토큰의 데이터에 있는 회사가 있는지 확인하는 부분
        String id = jwtUtil.valnoateToken(token);
        CompanyEntity companyEntity = companyRepository.findByCid(id);
        if(companyEntity == null) { return false; }
        Optional<ProjectEntity> optional = projectRepository.findById(projectDto.getPno());
        if(optional.isPresent()) {
            ProjectEntity projectEntity = optional.get();
            LocalDateTime today = LocalDateTime.now();
            // 현재 날짜가 모집 시작일보다 클 때 수정 할 수 없도록 false 반환
            if(today.isAfter(projectEntity.getRecruit_pstart())) { return false; }
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

    /// | 프로젝트 삭제 | <br/>
    /// ● <b>회사</b>가 프로젝트를 삭제
    public boolean deleteProject(String token, int pno) {
        System.out.println("ProjectService.deleteProject");
        System.out.println("token = \n" + token + "\npno = " + pno);
        // 토큰의 데이터에 있는 회사가 있는지 확인하는 부분
        String id = jwtUtil.valnoateToken(token);
        CompanyEntity companyEntity = companyRepository.findByCid(id);
        if(companyEntity == null) { return false; }
        Optional<ProjectEntity> optional = projectRepository.findById(pno);
        if(optional.isPresent()) {
            ProjectEntity projectEntity = optional.get();
            LocalDateTime today = LocalDateTime.now();
            // 현재 날짜가 모집 시작일보다 클 때 수정 할 수 없도록 false 반환
            if(today.isAfter(projectEntity.getRecruit_pstart())) { return false; }
            if(companyEntity.getCno() == projectEntity.getCompanyEntity().getCno() || projectEntity.getDelete_state() == 0) {
                projectEntity.setDelete_state(1);
                // projectRepository.deleteById(pno);
                return true;
            }
        }
        return false;
    }

}
