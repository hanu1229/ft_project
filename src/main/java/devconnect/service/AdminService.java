/*  AdminService 클래스 | rw 25-05-03 리팩토링 (주석 보완 완료)
    - 관리자 회원가입, 로그인(JWT 발급), 로그아웃, 전체 조회, 단건 조회, 수정, 삭제 기능 담당
    - 최근 승인 항목 및 월별 참여 통계 포함 (대시보드용)
    - 최근 24시간 로그인 접속자 수 기능 포함 (Admin, Company, Developer 별도 Redis 키)
*/

package devconnect.service;

// [A] DTO, Entity, Repository import
import devconnect.model.dto.AdminDto;
import devconnect.model.entity.AdminEntity;
import devconnect.model.entity.CompanyEntity;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.entity.ProjectEntity;
import devconnect.model.repository.AdminEntityRepository;
import devconnect.util.JwtUtil;

// [B] 스프링 관련 import
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

// [C] 기타 유틸
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service // [A-1] 서비스 컴포넌트 명시
@Transactional // [A-2] 트랜잭션 처리 적용
@RequiredArgsConstructor // [B-1] 생성자 기반 의존성 주입
public class AdminService { // CS

    private final AdminEntityRepository adminEntityRepository;
    private final StringRedisTemplate stringRedisTemplate;
    private final JwtUtil jwtUtil;

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
        // [방법1] 일반 방식 ============================= //
        AdminEntity entity = adminEntityRepository.findByAdid(adid).orElse(null);
        if (entity == null || !new BCryptPasswordEncoder().matches(adpwd, entity.getAdpwd())) return null;
        String token = jwtUtil.createToken(adid, "Admin");
        stringRedisTemplate.opsForValue().set("RESENT_LOGIN_ADMIN:" + adid, "true", 1, TimeUnit.DAYS);
        return token;

        // [방법2] Stream 방식 ============================= //
        // return adminEntityRepository.findByAdid(adid)
        //         .filter(e -> new BCryptPasswordEncoder().matches(adpwd, e.getAdpwd()))
        //         .map(e -> {
        //             stringRedisTemplate.opsForValue().set("RESENT_LOGIN_ADMIN:" + adid, "true", 1, TimeUnit.DAYS);
        //             return jwtUtil.createToken(adid, "Admin");
        //         }).orElse(null);
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

        // [방법1] 일반 방식 ============================= //
//        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(adid);
//        if (optional.isPresent()) {
//            return optional.get().toDto();
//        }
//        return null;

        // [방법2] Stream 방식 ============================= //
        return adid == null ? null : adminEntityRepository.findByAdid(adid).map(AdminEntity::toDto).orElse(null);
    }

    // =======================================================================================
    // [6] 관리자 정보 수정
    public boolean adminUpdate(AdminDto dto, String loginAdid) {
        // [방법1] 일반 방식 ============================= //
//        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(loginAdid);
//        if (optional.isPresent()) {
//            AdminEntity entity = optional.get();
//            entity.setAdname(dto.getAdname());
//            entity.setAdphone(dto.getAdphone());
//            adminEntityRepository.save(entity);
//            return true;
//        }
//        return false;

        // [방법2] Stream 방식 ============================= //
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
        // [방법1] 일반 방식 ============================= //
//        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(adid);
//        if (optional.isPresent()) {
//            AdminEntity entity = optional.get();
//            entity.setAdtype(9);
//            adminEntityRepository.save(entity);
//            return true;
//        }
//        return false;

        // [방법2] Stream 방식 ============================= //
        return adminEntityRepository.findByAdid(adid).map(entity -> {
            entity.setAdtype(9);
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

} // CE
