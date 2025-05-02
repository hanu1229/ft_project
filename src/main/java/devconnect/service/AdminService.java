/*  AdminService 클래스 | rw 25-04-27 리팩토링
    - 관리자 회원가입, 로그인(JWT 발급), 로그아웃, 전체 조회, 개별 조회, 수정, 삭제 기능 담당
    - 비밀번호는 BCrypt 암호화 적용
    - 삭제는 adtype 상태값 변경 방식으로 처리
*/

package devconnect.service;

// [*] DTO, Entity, Repository import
import devconnect.model.dto.AdminDto;
import devconnect.model.entity.AdminEntity;
import devconnect.model.repository.AdminEntityRepository;

// [*] 스프링 관련 import
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Service // [A] 이 클래스가 서비스 컴포넌트임을 명시
@Transactional // [B] 트랜잭션 처리 적용 (롤백 포함)
@RequiredArgsConstructor // [C] 생성자 기반 의존성 주입
public class AdminService { // CS

    // =======================================================================================
    // [*] 의존성 주입 필드

    private final AdminEntityRepository adminEntityRepository; // [1] 관리자 레포지토리
    private final StringRedisTemplate stringRedisTemplate;     // [2] Redis 템플릿
    private final JwtUtil jwtUtil;                             // [3] JWT 유틸

    @PersistenceContext // [4] JPA 쿼리용 EntityManager 수동 주입
    private EntityManager em; // [5] 직접 JPQL 쿼리 수행용

    // =======================================================================================
    // [1] 관리자 회원가입 기능
    public boolean adminSignUp(AdminDto adminDto) { // fs

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPwd = passwordEncoder.encode(adminDto.getAdpwd()); // (1) 비밀번호 암호화
        adminDto.setAdpwd(hashedPwd);

        AdminEntity adminEntity = adminDto.toEntity(); // (2) DTO → Entity 변환
        AdminEntity saveEntity = adminEntityRepository.save(adminEntity); // (3) 저장

        return saveEntity.getAdno() >= 1; // (4) 성공 여부 반환
    } // fe

    // [2] 관리자 로그인 기능 (JWT 발급)
    public String adminLogIn(String adid, String adpwd) { // 파라미터 변경

        System.out.println("[로그인 요청] 입력된 adid: " + adid);
        System.out.println("[로그인 요청] 입력된 adpwd: " + adpwd);

        AdminEntity adminEntity = adminEntityRepository.findByAdid(adid).orElse(null);
        if (adminEntity == null) {
            System.out.println("[실패] 해당 ID가 존재하지 않음: " + adid);
            return null;
        }

        System.out.println("[DB 조회 결과] 암호화된 비밀번호: " + adminEntity.getAdpwd());

        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        boolean isMatch = passwordEncoder.matches(adpwd, adminEntity.getAdpwd());
        System.out.println("[검증] 비밀번호 일치 여부: " + isMatch);
        System.out.println(">> 입력된 비밀번호 길이: " + adpwd.length());
        System.out.println(">> 입력된 비밀번호 HEX: " + adpwd.chars()
                .mapToObj(c -> String.format("%02x", c))
                .reduce("", (a, b) -> a + " " + b));

        if (!isMatch) {
            System.out.println("[실패] 비밀번호 불일치");
            return null; // (2) 비밀번호 불일치
        }

        String token = jwtUtil.createToken(adminEntity.getAdid(), "Admin"); // (3) JWT 발급
        System.out.println("[성공] 발급된 JWT 토큰: " + token);

        stringRedisTemplate.opsForValue().set(
                "RESENT_LOGIN:" + adminEntity.getAdid(),
                "true",
                1,
                TimeUnit.DAYS
        ); // (4) Redis에 24시간 저장

        return token;
    }

    // =======================================================================================
    // [3] 관리자 로그아웃 기능 (Redis 토큰 삭제)
    public void adminLogout(String token) { // fs
        String adid = jwtUtil.valnoateToken(token); // (1) 토큰에서 ID 추출
        if (adid != null) {
            jwtUtil.deleteToken(adid); // (2) Redis에서 토큰 삭제
        }
    } // fe

    // =======================================================================================
    // [4] 관리자 전체 조회 기능
    public List<AdminDto> adminFindAll() { // fs
        return adminEntityRepository.findAll()
                .stream()
                .map(AdminEntity::toDto) // (1) Entity → DTO 변환
                .collect(Collectors.toList());
    } // fe

    // =======================================================================================
    // [5] 관리자 삭제 기능 (상태 변경 방식)
    public boolean adminDelete(String adid) { // fs
        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(adid);
        if (optional.isEmpty()) return false; // (1) 관리자 존재 여부 확인

        AdminEntity entity = optional.get();
        entity.setAdtype(9); // (2) 상태값 9 (삭제 처리)
        adminEntityRepository.save(entity); // (3) 수정 저장
        return true;
    } // fe

    // =======================================================================================
// [6] 관리자 개별 조회 기능 (by 토큰)
    public AdminDto adminFindById(String token) { // fs
        String adid = jwtUtil.valnoateToken(token); // (1) 토큰 검증 후 아이디 추출
        if (adid == null) return null; // (2) 토큰이 유효하지 않으면 null

        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(adid); // (3) Optional로 조회
        if (optional.isEmpty()) return null; // (4) 조회 실패 시 null

        AdminEntity adminEntity = optional.get(); // (5) 조회 성공 시 Entity 꺼내기
        return adminEntity.toDto(); // (6) Entity → DTO 변환 후 반환
    } // fe

    // =======================================================================================
    // [7] 관리자 정보 수정 기능
    public boolean adminUpdate(AdminDto dto, String loginAdid) { // fs
        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(loginAdid);
        if (optional.isEmpty()) return false; // (1) 로그인 관리자 존재 여부 확인

        AdminEntity entity = optional.get();
        entity.setAdname(dto.getAdname()); // (2) 이름 수정
        entity.setAdphone(dto.getAdphone()); // (3) 전화번호 수정
        adminEntityRepository.save(entity); // (4) 저장
        return true;
    } // fe

    // =======================================================================================
    // [*] 전체 통계 조회 (기업/개발자/프로젝트/참여/평가)
    public Map<String, Object> getDashboardStats() { // fs
        Map<String, Object> map = new HashMap<>();

        map.put("companyCount", em.createQuery("SELECT COUNT(c) FROM CompanyEntity c", Long.class).getSingleResult());
        map.put("developerCount", em.createQuery("SELECT COUNT(d) FROM DeveloperEntity d", Long.class).getSingleResult());
        map.put("projectCount", em.createQuery("SELECT COUNT(p) FROM ProjectEntity p", Long.class).getSingleResult());
        map.put("projectJoinCount", em.createQuery("SELECT COUNT(pj) FROM ProjectJoinEntity pj", Long.class).getSingleResult());
        map.put("cratingCount", em.createQuery("SELECT COUNT(c) FROM CratingEntity c", Long.class).getSingleResult());
        map.put("dratingCount", em.createQuery("SELECT COUNT(d) FROM DratingEntity d", Long.class).getSingleResult());

        return map;
    } // fe

    // =======================================================================================
    // [*] 최근 승인된 항목 5개씩 추출 (기업/개발자/프로젝트)
    public Map<String, Object> getRecentApprovedList() { // fs
        Map<String, Object> result = new HashMap<>();

        result.put("companies", em.createQuery("SELECT c FROM CompanyEntity c WHERE c.cstate = 1 ORDER BY c.updateAt DESC", Object.class)
                .setMaxResults(5).getResultList());
        result.put("developers", em.createQuery("SELECT d FROM DeveloperEntity d WHERE d.dstate = 1 ORDER BY d.updateAt DESC", Object.class)
                .setMaxResults(5).getResultList());
        result.put("projects", em.createQuery("SELECT p FROM ProjectEntity p ORDER BY p.createAt DESC", Object.class)
                .setMaxResults(5).getResultList());

        return result;
    } // fe

    // =======================================================================================
    // [*] 월별 프로젝트 참여 수 통계 (LineChart용)
    public List<Map<String, Object>> getMonthlyJoinStats() { // fs
        List<Object[]> rows = em.createQuery(
                "SELECT FUNCTION('DATE_FORMAT', pj.pjtime, '%Y-%m') AS month, COUNT(pj) FROM ProjectJoinEntity pj GROUP BY month ORDER BY month",
                Object[].class).getResultList();

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : rows) {
            Map<String, Object> map = new HashMap<>();
            map.put("month", row[0]);
            map.put("joins", row[1]);
            result.add(map);
        }
        return result;
    } // fe

} // CE