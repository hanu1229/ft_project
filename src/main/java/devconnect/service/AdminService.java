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
import devconnect.util.JwtUtil;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
// ✅ 7. 관리자 기반 프로젝트참여 전체 조회 서비스
// =======================================================================================
/*
    - 설명: 프로젝트참여 전체 리스트를 가져옵니다.
    - 반환: List<ProjectJoinDto>
*/
    public List<ProjectJoinDto> getAllProjectJoins() {
        return projectJoinRepository.findAll().stream()
                .map(ProjectJoinEntity::toDto)
                .collect(Collectors.toList());
    }



} // CE