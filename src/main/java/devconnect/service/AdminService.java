/*  AdminService 클래스 | rw 25-05-02 최종 리팩토링
    - 관리자 회원가입, 로그인(JWT 발급), 로그아웃, 전체 조회, 개별 조회, 수정, 삭제 기능 담당
    - 최근 승인 항목 및 월별 참여 통계 포함 (대시보드용)
    - 최근 24시간 로그인 접속자 수 기능 포함 (Admin, Company, Developer 별도 Redis 키)
*/

package devconnect.service;

import devconnect.model.dto.*;
import devconnect.model.dto.developer.DeveloperDto;
import devconnect.model.entity.*;
import devconnect.model.repository.*;
import devconnect.util.FileUtil;
import devconnect.util.JwtUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {

    private final AdminEntityRepository adminEntityRepository;
    private final StringRedisTemplate stringRedisTemplate;
    private final JwtUtil jwtUtil;
    private final CompanyRepository companyRepository;
    private final DeveloperRepository developerRepository;
    private final CratingRepository cratingRepository;
    private final DratingRepository dratingRepository;
    private final ProjectRepository projectRepository;
    private final ProjectJoinRepository projectJoinRepository;
    private final FileUtil fileUtil;

    @PersistenceContext
    private EntityManager em;

    // =======================================================================================
    // [1] 관리자 회원가입
    public boolean adminSignUp(AdminDto adminDto) {
        String hashedPwd = new BCryptPasswordEncoder().encode(adminDto.getAdpwd());
        adminDto.setAdpwd(hashedPwd);
        AdminEntity entity = adminDto.toEntity();
        return adminEntityRepository.save(entity).getAdno() != null;
    }

    // =======================================================================================
    // [2] 관리자 로그인 (JWT 발급 + Redis 최근 로그인 기록)
    public String adminLogIn(String adid, String adpwd) {
        AdminEntity entity = adminEntityRepository.findByAdid(adid).orElse(null);
        if (entity == null || !new BCryptPasswordEncoder().matches(adpwd, entity.getAdpwd())) return null;
        String token = jwtUtil.createToken(adid, "Admin");
        stringRedisTemplate.opsForValue().set("RESENT_LOGIN_ADMIN:" + adid, "true", 1, TimeUnit.DAYS);
        return token;
    }

    // =======================================================================================
    // [3] 관리자 로그아웃
    public void adminLogout(String token) {
        String adid = jwtUtil.valnoateToken(token);
        if (adid != null) jwtUtil.deleteToken(adid);
    }

    // =======================================================================================
    // [4] 관리자 전체 조회
    public List<AdminDto> adminFindAll() {
        return adminEntityRepository.findAll().stream().map(AdminEntity::toDto).collect(Collectors.toList());
    }

    // =======================================================================================
    // [5] 관리자 단건 조회
    public AdminDto adminFindById(String token) {
        String adid = jwtUtil.valnoateToken(token);
        return adid == null ? null : adminEntityRepository.findByAdid(adid).map(AdminEntity::toDto).orElse(null);
    }

    // =======================================================================================
    // [6] 관리자 정보 수정
    public boolean adminUpdate(AdminDto dto, String loginAdid) {
        return adminEntityRepository.findByAdid(loginAdid).map(entity -> {
            entity.setAdname(dto.getAdname());
            entity.setAdphone(dto.getAdphone());
            adminEntityRepository.save(entity);
            return true;
        }).orElse(false);
    }

    // =======================================================================================
    // [7] 관리자 삭제
    public boolean adminDelete(String adid) {
        return adminEntityRepository.findByAdid(adid).map(entity -> {
            entity.setAdtype(3);
            adminEntityRepository.save(entity);
            return true;
        }).orElse(false);
    }

    // =======================================================================================
    // [8] 대시보드 통계 카드용 수치 조회
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("companyCount", em.createQuery("SELECT COUNT(c) FROM CompanyEntity c", Long.class).getSingleResult());
        stats.put("developerCount", em.createQuery("SELECT COUNT(d) FROM DeveloperEntity d", Long.class).getSingleResult());
        stats.put("projectCount", em.createQuery("SELECT COUNT(p) FROM ProjectEntity p", Long.class).getSingleResult());
        stats.put("projectJoinCount", em.createQuery("SELECT COUNT(pj) FROM ProjectJoinEntity pj", Long.class).getSingleResult());
        stats.put("cratingCount", em.createQuery("SELECT COUNT(c) FROM CratingEntity c", Long.class).getSingleResult());
        stats.put("dratingCount", em.createQuery("SELECT COUNT(d) FROM DratingEntity d", Long.class).getSingleResult());
        return stats;
    }

    // =======================================================================================
    // [9] 최근 승인 항목 5개씩 반환
    public Map<String, Object> getRecentApprovedList() {
        Map<String, Object> result = new HashMap<>();

        result.put("companies", em.createQuery("SELECT c FROM CompanyEntity c WHERE c.cstate = 1 ORDER BY c.updateAt DESC", CompanyEntity.class)
                .setMaxResults(5).getResultList().stream()
                .map(c -> Map.of("id", c.getCno(), "name", c.getCname(), "updateAt", c.getUpdateAt()))
                .collect(Collectors.toList()));

        result.put("developers", em.createQuery("SELECT d FROM DeveloperEntity d WHERE d.dstate = 1 ORDER BY d.updateAt DESC", DeveloperEntity.class)
                .setMaxResults(5).getResultList().stream()
                .map(d -> Map.of("id", d.getDno(), "name", d.getDname(), "updateAt", d.getUpdateAt()))
                .collect(Collectors.toList()));

        result.put("projects", em.createQuery("SELECT p FROM ProjectEntity p ORDER BY p.createAt DESC", ProjectEntity.class)
                .setMaxResults(5).getResultList().stream()
                .map(p -> Map.of("id", p.getPno(), "name", p.getPname(), "approvedAt", p.getCreateAt()))
                .collect(Collectors.toList()));

        return result;
    }

    // =======================================================================================
    // [10] 월별 프로젝트 참여 통계
    public List<Map<String, Object>> getMonthlyJoinStats() {
        List<Object[]> rows = em.createQuery(
                "SELECT FUNCTION('DATE_FORMAT', pj.createAt, '%Y-%m'), COUNT(pj) FROM ProjectJoinEntity pj GROUP BY FUNCTION('DATE_FORMAT', pj.createAt, '%Y-%m') ORDER BY FUNCTION('DATE_FORMAT', pj.createAt, '%Y-%m')",
                Object[].class).getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            result.add(Map.of("month", row[0], "joins", row[1]));
        }
        return result;
    }

    // =======================================================================================
    // [11] 최근 24시간 로그인 접속자 수 반환 (Admin 전용)
    public int loginCount() {
        Set<String> keys = stringRedisTemplate.keys("RESENT_LOGIN_ADMIN:*");
        return keys == null ? 0 : keys.size();
    }

    // =======================================================================================
    // [12] 기업 고객 최근 24시간 로그인 수
    public int companyLoginCount() {
        Set<String> keys = stringRedisTemplate.keys("RESENT_LOGIN_COMPANY:*");
        return keys == null ? 0 : keys.size();
    }

    // =======================================================================================
    // [13] 개발자 고객 최근 24시간 로그인 수
    public int developerLoginCount() {
        Set<String> keys = stringRedisTemplate.keys("RESENT_LOGIN_DEVELOPER:*");
        return keys == null ? 0 : keys.size();
    }
    // =======================================================================================
// ✅ 1. 관리자 기반 기업 상세조회 (cno 기반) API-메서드
// =======================================================================================
    /*
    - 설명: 기업의 고유번호(cno)를 기반으로 기업 정보를 조회하여 CompanyDto로 반환합니다.
    - 사용 위치: AdminController → /api/admin/company/detail
    - 반환 조건:
        • 해당 cno가 존재하면 CompanyDto 반환
        • 존재하지 않으면 null 반환
    - 참고:
        • .map(CompanyEntity::toDto) : 엔티티를 DTO로 변환
        • .orElse(null) : 조회 결과 없을 경우 null 반환
    */
    public CompanyDto getCompanyDetail(int cno)  {
        return companyRepository.findById(cno)
                .map(CompanyEntity::toDto)
                .orElse(null);
    }


    // =======================================================================================
    // ✅ 2. 관리자 기반 개발자 상세조회 (dno 기반)
// =======================================================================================
/*
    - 설명: 개발자의 고유번호(dno)를 기반으로 개발자 정보를 조회하여 DeveloperDto로 반환합니다.
    - 사용 위치: AdminController → /api/admin/developer/detail
    - 반환 조건:
        • 해당 dno가 존재하면 DeveloperDto 반환
        • 존재하지 않으면 null 반환
    - 참고:
        • .map(DeveloperEntity::toDto) : 엔티티를 DTO로 변환
        • .orElse(null) : 조회 결과 없을 경우 null 반환
*/
    public DeveloperDto getDeveloperDetail(int dno) {
        return developerRepository.findById(dno)
                .map(DeveloperEntity::toDto)
                .orElse(null);
    }

// =======================================================================================
    // ✅ 3. 관리자 기반 기업평가 상세조회 (crno 기반)
// =======================================================================================
/*
    - 설명: 기업평가의 고유번호(dno)를 기반으로 기업평가 정보를 조회하여 CratingDto로 반환합니다.
    - 사용 위치: AdminController → /api/admin/crating/detail
    - 반환 조건:
        • 해당 crno가 존재하면 CratingDto 반환
        • 존재하지 않으면 null 반환
    - 참고:
        • .map(CratingEntity::toDto) : 엔티티를 DTO로 변환
        • .orElse(null) : 조회 결과 없을 경우 null 반환
*/

    public CratingDto getCratingDetail(int crno) {
        return cratingRepository.findById(crno)
                .map(CratingEntity::toDto)
                .orElse(null);
    }

// =======================================================================================
    // ✅ 4. 관리자 기반 개발자평가 상세조회 (drno 기반)
// =======================================================================================
/*
    - 설명: 개발자평가의 고유번호(drno)를 기반으로 개발자평가 정보를 조회하여 DratingDto로 반환합니다.
    - 사용 위치: AdminController → /api/admin/drating/detail
    - 반환 조건:
        • 해당 drno가 존재하면 DratingDto 반환
        • 존재하지 않으면 null 반환
    - 참고:
        • .map(DratingEntity::toDto) : 엔티티를 DTO로 변환
        • .orElse(null) : 조회 결과 없을 경우 null 반환
*/

    public DratingDto getDratingDetail(int drno) {
        return dratingRepository.findById(drno)
                .map(DratingEntity::toDto)
                .orElse(null);
    }


// =======================================================================================
    // ✅ 5. 관리자 기반 프로젝트(기업) 상세조회 (pno 기반)
// =======================================================================================
/*
    - 설명: 프로젝트(기업)의 고유번호(pno)를 기반으로 프로젝트(기업) 정보를 조회하여 ProjectDto로 반환합니다.
    - 사용 위치: AdminController → /api/admin/project/detail
    - 반환 조건:
        • 해당 drno가 존재하면 ProjectDto 반환
        • 존재하지 않으면 null 반환
    - 참고:
        • .map(ProjectEntity::toDto) : 엔티티를 DTO로 변환
        • .orElse(null) : 조회 결과 없을 경우 null 반환
*/

    public ProjectDto getProjectDetail(int pno) {
        return projectRepository.findById(pno)
                .map(ProjectEntity::toDto)
                .orElse(null);
    }

// =======================================================================================
    // ✅ 6. 관리자 기반 프로젝트참여(개발자) 상세조회 (pjno 기반)
// =======================================================================================
/*
    - 설명: 프로젝트참여(개발자)의 고유번호(pjno)를 기반으로 프로젝트참여(개발자)를 조회하여 ProjectJoinDto로 반환합니다.
    - 사용 위치: AdminController → /api/admin/project-join/detail
    - 반환 조건:
        • 해당 pjno가 존재하면 ProjectJoinDto 반환
        • 존재하지 않으면 null 반환
    - 참고:
        • .map(DratingEntity::toDto) : 엔티티를 DTO로 변환
        • .orElse(null) : 조회 결과 없을 경우 null 반환
*/


    public ProjectJoinDto getProjectJoinDetail(int pjno) {
        return projectJoinRepository.findById(pjno)
                .map(ProjectJoinEntity::toDto)
                .orElse(null);
    }

// =======================================================================================
// ✅ 1. 관리자 기반 프로젝트참여 전체조회
// =======================================================================================
/*
    - 설명: 프로젝트참여 전체 리스트를 조회하여 ProjectJoinDto 리스트로 반환합니다.
    - 사용 위치: AdminController → /api/admin/project-join/alljoin
    - 반환 조건:
        • 프로젝트참여 테이블 전체 데이터를 조회하여 DTO 리스트로 변환
        • 데이터가 없을 경우 빈 리스트([]) 반환
    - 참고:
        • .map(ProjectJoinEntity::toDto) : 엔티티를 DTO로 변환
        • .collect(Collectors.toList()) : 변환된 DTO를 리스트로 수집
*/

    public List<ProjectJoinDto> getAllProjectJoins() {
        return projectJoinRepository.findAll().stream()
                .map(ProjectJoinEntity::toDto)
                .collect(Collectors.toList());
    }

// =======================================================================================
// ✅ 1. 관리자 기반 기업 삭제 (상태값 변경 방식)
// =======================================================================================
/*
    - 설명: 관리자 권한으로 특정 기업의 상태(state)를 9로 변경하여 삭제 처리합니다.
           실제 삭제는 하지 않고 상태값 변경을 통해 '삭제됨'으로 간주합니다.
    - 사용 위치: AdminController → /api/admin/company/delete
    - 반환 조건:
        • 해당 기업번호(cno)가 존재하면 상태를 9로 수정하고 true 반환
        • 존재하지 않으면 false 반환
    - 참고:
        • .map(entity -> { ... }) : Optional 내부 엔티티에 접근하여 수정
        • entity.setState(9) : 상태값을 삭제 상태로 지정
        • @Transactional이 선언되어 있다면 save 생략 가능
*/

    public boolean companyDelete(int cno) { // 1. 컨트롤러로부터 삭제(상태변경)할 기업 번호를 매개변수로 받는다.
        // 2. 기업번호에 해당하는 엔티티(기업정보객체)를 찾아서 존재하면
        return companyRepository.findById(cno).map(entity -> {
            entity.setState(9); // 상태를 9로 수정(set)한다.
            companyRepository.save(entity); // 수정한 정보를 반영(save) 한다. 서비스에서 @Transactional 사용 시 생략 가능.
            return true; // 수정 성공 시 true 반환
        }).orElse(false); // 기업번호에 해당하는 엔티티가 없으면 false 반환
    }

// =======================================================================================
// ✅ 2. 관리자 기반 개발자 삭제 (boolean 상태값 기반)
// =======================================================================================
/*
    - 설명: 관리자 권한으로 특정 개발자의 상태(dstate)를 false로 변경하여 삭제 처리합니다.
           실제 삭제는 하지 않고 비활성화(true → false)로 간주합니다.
    - 사용 위치: AdminController → /api/admin/developer/delete
    - 반환 조건:
        • 해당 개발자번호(dno)가 존재하면 상태를 false로 수정하고 true 반환
        • 존재하지 않으면 false 반환
*/

    public boolean developerDelete(int dno) {
        return developerRepository.findById(dno).map(entity -> {
            entity.setDstate(false); // ✅ 상태를 false로 설정 → 삭제된 상태로 간주
            developerRepository.save(entity);
            return true;
        }).orElse(false);
    }

// =======================================================================================
// ✅ 3. 관리자 기반 기업평가 삭제 (상태값 변경 방식)
// =======================================================================================
/*
    - 설명: 관리자 권한으로 특정 기업평가의 상태(crstate)를 9로 변경하여 삭제 처리합니다.
           실제 삭제는 하지 않고 상태값 변경을 통해 '삭제됨'으로 간주합니다.
    - 사용 위치: AdminController → /api/admin/crating/delete
    - 반환 조건:
        • 해당 평가번호(crno)가 존재하면 상태를 9로 수정하고 true 반환
        • 존재하지 않으면 false 반환
    - 참고:
        • .map(entity -> { ... }) : Optional 내부 엔티티에 접근하여 수정
        • entity.setCrstate(9) : 상태값을 삭제 상태로 지정
        • @Transactional이 선언되어 있다면 save 생략 가능
*/

    public boolean cratingDelete(int crno) { // 1. 컨트롤러로부터 삭제(상태변경)할 기업평가 번호를 매개변수로 받는다.
        // 2. 기업평가번호에 해당하는 엔티티(평가정보객체)를 찾아서 존재하면
        return cratingRepository.findById(crno).map(entity -> {
            entity.setCrstate(9); // 상태를 9로 수정(set)한다.
            cratingRepository.save(entity); // 수정한 정보를 반영(save) 한다. 서비스에서 @Transactional 사용 시 생략 가능.
            return true; // 수정 성공 시 true 반환
        }).orElse(false); // 평가번호에 해당하는 엔티티가 없으면 false 반환
    }

// =======================================================================================
// ✅ 4. 관리자 기반 개발자평가 삭제 (상태값 변경 방식)
// =======================================================================================
/*
    - 설명: 관리자 권한으로 특정 개발자평가의 상태(drstate)를 9로 변경하여 삭제 처리합니다.
           실제 삭제는 하지 않고 상태값 변경을 통해 '삭제됨'으로 간주합니다.
    - 사용 위치: AdminController → /api/admin/drating/delete
    - 반환 조건:
        • 해당 평가번호(drno)가 존재하면 상태를 9로 수정하고 true 반환
        • 존재하지 않으면 false 반환
    - 참고:
        • .map(entity -> { ... }) : Optional 내부 엔티티에 접근하여 수정
        • entity.setDrstate(9) : 상태값을 삭제 상태로 지정
        • @Transactional이 선언되어 있다면 save 생략 가능
*/

    public boolean dratingDelete(int drno) { // 1. 컨트롤러로부터 삭제(상태변경)할 개발자평가 번호를 매개변수로 받는다.
        // 2. 개발자평가번호에 해당하는 엔티티(평가정보객체)를 찾아서 존재하면
        return dratingRepository.findById(drno).map(entity -> {
            entity.setDrstate(9); // 상태를 9로 수정(set)한다.
            dratingRepository.save(entity); // 수정한 정보를 반영(save) 한다. 서비스에서 @Transactional 사용 시 생략 가능.
            return true; // 수정 성공 시 true 반환
        }).orElse(false); // 평가번호에 해당하는 엔티티가 없으면 false 반환
    }

// =======================================================================================
// ✅ 5. 관리자 기반 프로젝트 삭제 서비스 (물리 삭제)
// =======================================================================================
/*
    - 설명: 실제 DB에서 프로젝트를 삭제합니다.
    - 사용 위치: AdminController → /api/admin/project/delete
    - 반환 조건:
        • 해당 프로젝트가 존재하면 삭제 후 true 반환
        • 존재하지 않으면 false 반환
*/

    public boolean deleteProjectPhysically(int pno) {
        if (!projectRepository.existsById(pno)) return false; // 존재하지 않으면 실패
        projectRepository.deleteById(pno); // ✅ 실제 삭제 수행
        return true;
    }

// =======================================================================================
// ✅ 6. 관리자 기반 프로젝트참여 삭제 서비스 (물리 삭제)
// =======================================================================================
/*
    - 설명: 실제 DB에서 프로젝트참여 데이터를 삭제합니다.
    - 사용 위치: AdminController → /api/admin/project-join/delete
    - 반환 조건:
        • 해당 프로젝트참여가 존재하면 삭제 후 true 반환
        • 존재하지 않으면 false 반환
*/

    public boolean deleteProjectJoinPhysically(int pjno) {
        if (!projectJoinRepository.existsById(pjno)) return false; // 존재하지 않으면 실패
        projectJoinRepository.deleteById(pjno); // ✅ 실제 삭제
        return true;
    }

// =======================================================================================
// ✅ 1. 관리자 기반 기업 수정  (@ModelAttribute 방식)
// =======================================================================================
/*
    - 설명: 관리자가 기업 정보를 수정하는 기능입니다. 수정 가능한 항목은 기업명, 전화번호,
            이메일, 주소, 사업자번호, 비밀번호(선택), 프로필 이미지(선택)입니다.
    - 사용 위치: AdminController.updateCompany()
    - 반환 조건:
        • 기업이 존재하면 → 정보 수정 후 true 반환
        • 기업이 존재하지 않거나 예외 발생 시 → false 반환
    - 참고:
        • MultipartFile이 존재하면 파일 업로드 후 기존 이미지 변경
        • 비밀번호는 upcpwd로 전달되며, null이 아닌 경우에만 덮어씀
        • 수정일(updateAt) 갱신 포함
*/

    public boolean updateCompany(CompanyDto dto) {
        Optional<CompanyEntity> optional = companyRepository.findById(dto.getCno());

        if (optional.isPresent()) {
            CompanyEntity company = optional.get();

            // 기본 정보 수정
            company.setCname(dto.getCname());
            company.setCphone(dto.getCphone());
            company.setCadress(dto.getCadress());
            company.setCemail(dto.getCemail());
            company.setCbusiness(dto.getCbusiness());
            company.setUpdateAt(LocalDateTime.now());

            // 비밀번호 변경 (선택)
            if (dto.getUpcpwd() != null && !dto.getUpcpwd().isEmpty()) {
                company.setCpwd(dto.getUpcpwd());
            }

            // 프로필 이미지 업로드 (선택)
            if (dto.getFile() != null && !dto.getFile().isEmpty()) {
                String fileName = fileUtil.fileUpload(dto.getFile());  // ✅ 메서드명 일치
                company.setCprofile("/upload/" + fileName);            // ✅ 접두어 추가
            }

            companyRepository.save(company);
            return true;
        }

        return false;
    }

// =======================================================================================
// ✅ 2. 관리자 기반 개발자 수정  (@ModelAttribute 방식)
// =======================================================================================
/*
    - 설명: 관리자가 개발자 정보를 수정하는 기능입니다. 수정 가능한 항목은 이름, 연락처,
            주소, 이메일, 레벨, 경험치, 프로필 이미지(선택) 등입니다.
    - 사용 위치: AdminController.updateDeveloper()
    - 반환 조건:
        • 개발자가 존재하면 → 정보 수정 후 true 반환
        • 개발자가 존재하지 않거나 예외 발생 시 → false 반환
    - 참고:
        • MultipartFile(dfile)이 존재하면 파일 업로드 후 기존 이미지 변경
        • 수정일(updateAt) 갱신 포함
*/

    public boolean updateDeveloper(DeveloperDto dto) {
        Optional<DeveloperEntity> optional = developerRepository.findById(dto.getDno());

        if (optional.isPresent()) {
            DeveloperEntity developer = optional.get();

            // 1. 기본 정보 수정
            developer.setDname(dto.getDname());
            developer.setDphone(dto.getDphone());
            developer.setDaddress(dto.getDaddress());
            developer.setDemail(dto.getDemail());
            developer.setDlevel(dto.getDlevel());
            developer.setDcurrentExp(dto.getDcurrentExp());
            developer.setDtotalExp(dto.getDtotalExp());
            developer.setUpdateAt(LocalDateTime.now());

            // 2. 비밀번호 수정 (선택)
            if (dto.getDpwd() != null && !dto.getDpwd().isEmpty()) {
                developer.setDpwd(dto.getDpwd()); // ⚠️ 필요 시 암호화
            }

            // 3. 프로필 이미지 수정 (선택)
            if (dto.getDfile() != null && !dto.getDfile().isEmpty()) {
                String fileName = fileUtil.fileUpload(dto.getDfile());
                developer.setDprofile("/upload/" + fileName);
            }

            developerRepository.save(developer);
            return true;
        }

        return false;
    }

// =======================================================================================
// ✅ 3. 관리자 기반 기업평가 수정 (@RequestBody 방식)
// =======================================================================================
/*
    - 설명: 관리자가 기업평가 내용을 수정하는 기능입니다.
    - 사용 위치: AdminController.updateCrating()
    - 반환 조건:
        • 평가가 존재하면 → 항목 수정 후 true 반환
        • 평가가 존재하지 않거나 예외 발생 시 → false 반환
    - 참고:
        • 수정 대상: 제목, 내용, 점수, 상태코드
        • 프로젝트번호(pno), 개발자번호(dno)는 FK 관계상 수정하지 않음
        • 수정일(updateAt) 수동 갱신 포함
*/

    public boolean updateCrating(CratingDto dto) {
        Optional<CratingEntity> optional = cratingRepository.findById(dto.getCrno());

        if (optional.isPresent()) {
            CratingEntity crating = optional.get();

            // 수정 필드 설정
            crating.setCtitle(dto.getCtitle());
            crating.setCcontent(dto.getCcontent());
            crating.setCrscore(dto.getCrscore());
            crating.setCrstate(dto.getCrstate());
            crating.setUpdateAt(LocalDateTime.now());

            cratingRepository.save(crating);
            return true;
        }

        return false;
    }

// =======================================================================================
// ✅ 4. 관리자 기반 개발자평가 수정 (@RequestBody 방식)
// =======================================================================================
/*
    - 설명: 관리자가 개발자평가 내용을 수정하는 기능입니다.
    - 사용 위치: AdminController.updateDrating()
    - 반환 조건:
        • 평가가 존재하면 → 항목 수정 후 true 반환
        • 평가가 존재하지 않거나 예외 발생 시 → false 반환
    - 참고:
        • 수정 대상: 제목, 내용, 점수, 상태코드
        • 프로젝트번호(pno), 개발자번호(dno)는 FK 관계상 수정하지 않음
        • 수정일(updateAt) 수동 갱신 포함
*/

    public boolean updateDrating(DratingDto dto) {
        Optional<DratingEntity> optional = dratingRepository.findById(dto.getDrno());

        if (optional.isPresent()) {
            DratingEntity drating = optional.get();

            // 수정 대상 필드
            drating.setDtitle(dto.getDtitle());
            drating.setDcontent(dto.getDcontent());
            drating.setDrscore(dto.getDrscore());
            drating.setDrstate(dto.getDrstate());
            drating.setUpdateAt(LocalDateTime.now());

            dratingRepository.save(drating);
            return true;
        }

        return false;
    }

// =======================================================================================
// ✅ 5. 관리자 기반 프로젝트 수정 API (@ModelAttribute 방식)
// =======================================================================================
/*
    - 설명: 관리자가 프로젝트 정보를 수정하는 기능입니다.
    - 사용 위치: AdminController.updateProject()
    - 반환 조건:
        • 프로젝트가 존재하면 → 수정 후 true 반환
        • 프로젝트가 존재하지 않거나 예외 발생 시 → false 반환
    - 참고:
        • 파일이 존재하면 업로드 후 기존 이미지 초기화 후 재등록
        • 기업 연관 객체(companyEntity) 필요
        • 수정일(updateAt) 수동 반영
*/

    public boolean updateProject(ProjectDto dto) {
        Optional<ProjectEntity> optional = projectRepository.findById(dto.getPno());

        if (optional.isPresent()) {
            ProjectEntity project = optional.get();

            // 1. 기업 객체 조회
            CompanyEntity company = companyRepository.findById(dto.getCno()).orElse(null);
            if (company == null) return false;

            // 2. 기본 정보 수정
            project.setPname(dto.getPname());
            project.setPintro(dto.getPintro());
            project.setPtype(dto.getPtype());
            project.setPcomment(dto.getPcomment());
            project.setPcount(dto.getPcount());
            project.setPstart(dto.getPstart());
            project.setPend(dto.getPend());
            project.setRecruit_pstart(dto.getRecruit_pstart());
            project.setRecruit_pend(dto.getRecruit_pend());
            project.setPpay(dto.getPpay());
            project.setCompanyEntity(company);
            project.setUpdateAt(LocalDateTime.now());

            // 3. 기존 이미지 삭제
            project.getProjectImageEntityList().clear();

            // 4. 새 이미지 저장 (있는 경우만)
            if (dto.getFiles() != null && !dto.getFiles().isEmpty()) {
                for (MultipartFile file : dto.getFiles()) {
                    if (file != null && !file.isEmpty()) {
                        String fileName = fileUtil.fileUploadProjectImage(file);
                        ProjectImageEntity image = ProjectImageEntity.builder()
                                .iname("/upload/project_image/" + fileName)
                                .projectEntity(project)
                                .build();
                        project.getProjectImageEntityList().add(image);
                    }
                }
            }

            projectRepository.save(project);
            return true;
        }

        return false;
    }

// =======================================================================================
// ✅ 6. 관리자 기반 프로젝트참여 수정 API (@RequestBody 방식)
// =======================================================================================
/*
    - 설명: 관리자가 프로젝트참여 상태(pjtype)를 수정하는 기능입니다.
    - 사용 위치: AdminController.updateProjectJoin()
    - 반환 조건:
        • 신청 엔티티가 존재하면 → 상태 및 수정일 변경 후 true 반환
        • 존재하지 않으면 false 반환
    - 참고:
        • 상태(pjtype)는 승인/대기/거절 등 상태코드로 해석
        • 프로젝트 및 개발자 정보는 수정하지 않음
        • 수정일 updateAt 수동 갱신
*/

    public boolean updateProjectJoin(ProjectJoinDto dto) {
        Optional<ProjectJoinEntity> optional = projectJoinRepository.findById(dto.getPjno());

        if (optional.isPresent()) {
            ProjectJoinEntity join = optional.get();

            join.setPjtype(dto.getPjtype());
            join.setUpdateAt(LocalDateTime.now());

            projectJoinRepository.save(join);
            return true;
        }

        return false;
    }


} // CE