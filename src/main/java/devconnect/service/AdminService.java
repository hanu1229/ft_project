/*  AdminService 클래스 | rw 25-04-21 생성
    - 관리자 회원가입, 로그인, 단건 조회, 전건 조회 로직 처리
    - 비밀번호는 BCrypt로 암호화하여 저장
*/

package devconnect.service;

// [ * ] DTO, Entity, Repository
import devconnect.model.dto.AdminDto;
import devconnect.model.entity.AdminEntity;
import devconnect.model.repository.AdminEntityRepository;

// [ * ] 스프링 서비스 및 주입 어노테이션
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

// [ * ] 비밀번호 암호화 관련
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
// import java.util.stream.Collectors; // [&] Stream 방식 필요 시 주석 해제

@Service
@RequiredArgsConstructor
@Transactional
public class AdminService { // CS

    // [ * ] 의존성 주입
    private final AdminEntityRepository adminEntityRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // [1]. C | rw 25-04-21 생성
    // [1] 관리자 회원가입
    public boolean signUp(AdminDto dto) { // fs
        // (1) ID 중복 체크
        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(dto.getAdid());
        if (optional.isPresent()) return false;

        // (2) 비밀번호 암호화
        dto.setAdpwd(passwordEncoder.encode(dto.getAdpwd()));

        // (3) Entity 변환 후 저장
        AdminEntity entity = dto.toEntity();
        adminEntityRepository.save(entity);
        return true;

        // [&] Stream 방식 (불필요한 경우이나, 양식 통일 목적상 예시로 작성)
        /* return adminEntityRepository.findAll()
                .stream()
                .anyMatch(e -> e.getAdid().equals(dto.getAdid()))
            ? false
            : adminEntityRepository.save(dto.toEntity()) != null;
        */
    } // fe

    // [2]. C | rw 25-04-21 생성
    // [2] 관리자 로그인
    public String login(AdminDto dto) { // fs
        // (1) ID로 관리자 조회
        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(dto.getAdid());

        // (2) 비밀번호 일치 여부 확인
        if (optional.isPresent()) {
            AdminEntity admin = optional.get();
            if (passwordEncoder.matches(dto.getAdpwd(), admin.getAdpwd())) {
                return admin.getAdid(); // 로그인 성공 시 ID 반환
            }
        }
        return null; // 로그인 실패

        // [&] Stream 방식
        /* return adminEntityRepository.findByAdid(dto.getAdid())
                .filter(admin -> passwordEncoder.matches(dto.getAdpwd(), admin.getAdpwd()))
                .map(AdminEntity::getAdid)
                .orElse(null);
        */
    } // fe

    // [3]. R | rw 25-04-21 생성
    // [3] 관리자 단건 조회
    public AdminDto findByInfo(String adid) { // fs
        // (1) ID 기반 Entity 조회
        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(adid);

        // (2) 결과 존재 시 DTO 변환 후 반환
        if (optional.isPresent()) {
            AdminEntity admin = optional.get();
            return admin.toDto();
        }

        return null; // 결과 없을 시 null 반환

        // [&] Stream 방식
        /* return adminEntityRepository.findByAdid(adid)
                .map(AdminEntity::toDto)
                .orElse(null);
        */
    } // fe

    // [4]. R | rw 25-04-22 생성
    // [4] 관리자 전건 정보 조회
    public List<AdminDto> findAll() { // fs
        // (1) 모든 Entity 조회
        List<AdminEntity> adminEntityList = adminEntityRepository.findAll();

        // (2) Entity 리스트 → DTO 리스트 변환
        List<AdminDto> adminDtoList = new ArrayList<>();
        for (int i = 0; i < adminEntityList.size(); i++) {
            AdminDto adminDto = adminEntityList.get(i).toDto();
            adminDtoList.add(adminDto);
        }

        // (3) 결과 반환
        return adminDtoList;

        // [&] Stream 방식
        /* return adminEntityRepository.findAll()
                .stream()
                .map(AdminEntity::toDto)
                .collect(Collectors.toList());
        */
    } // fe

} // CE
