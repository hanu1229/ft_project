/*
 * AdminEntityServiceImpl 클래스 | rw 25-04-19 생성
 * - AdminEntityService 인터페이스 구현체
 * - 관리자 회원가입, 로그인, 단건 조회 로직 처리
 * - 비밀번호는 BCrypt로 암호화 처리
*/

        package devconnect.service;

// [*] DTO, Entity, Repository
import devconnect.model.dto.AdminDto;
import devconnect.model.entity.AdminEntity;
import devconnect.model.repository.AdminEntityRepository;

// [*] 스프링 서비스 및 자동 주입 어노테이션
import devconnect.service.AdminEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// [*] 비밀번호 암호화 관련
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@Service
@RequiredArgsConstructor
public class AdminEntityServiceImpl implements AdminEntityService { // CS

    // [*] 의존성 주입
    private final AdminEntityRepository adminRepo;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // [1] 회원가입 처리
    @Override
    public boolean signUp(AdminDto dto) { // fs
        if (adminRepo.findByAdid(dto.getAdid()).isPresent()) return false;

        // 비밀번호 암호화 후 저장
        dto.setAdpwd(passwordEncoder.encode(dto.getAdpwd()));

        AdminEntity entity = dto.toEntity();
        adminRepo.save(entity);
        return true;
    } // fe

    // [2] 로그인 처리
    @Override
    public String login(AdminDto dto) { // fs
        return adminRepo.findByAdid(dto.getAdid())
                .filter(admin -> passwordEncoder.matches(dto.getAdpwd(), admin.getAdpwd()))
                .map(AdminEntity::getAdid)
                .orElse(null);
    } // fe

    // [3] 관리자 단건 조회
    @Override
    public AdminDto findByAdid(String adid) { // fs
        return adminRepo.findByAdid(adid)
                .map(AdminEntity::toDto)
                .orElse(null);
    } // fe

} // CE