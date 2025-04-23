/*
// - AdminService 클래스 | rw 25-04-23 생성
// - 관리자 회원가입, 로그인, 정보조회, 수정, 상태변경 삭제 처리
// - 삭제는 실제 삭제가 아닌 상태 필드(adtype) 변경 방식 적용
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
        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(dto.getAdid());
        if (optional.isPresent()) return false;

        dto.setAdpwd(passwordEncoder.encode(dto.getAdpwd()));
        AdminEntity entity = dto.toEntity();
        adminEntityRepository.save(entity);
        return true;

        // [&] Stream 방식
        /*
        return adminEntityRepository.findAll()
                .stream()
                .anyMatch(e -> e.getAdid().equals(dto.getAdid()))
                ? false
                : adminEntityRepository.save(dto.toEntity()) != null;
        */
    } // fe

    // [2]. C | rw 25-04-21 생성
    // [2] 관리자 로그인
    public String login(AdminDto dto) { // fs
        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(dto.getAdid());
        if (optional.isPresent()) {
            AdminEntity admin = optional.get();
            if (passwordEncoder.matches(dto.getAdpwd(), admin.getAdpwd())) {
                return admin.getAdid();
            }
        }
        return null;

        // [&] Stream 방식
        /*
        return adminEntityRepository.findByAdid(dto.getAdid())
                .filter(admin -> passwordEncoder.matches(dto.getAdpwd(), admin.getAdpwd()))
                .map(AdminEntity::getAdid)
                .orElse(null);
        */
    } // fe

    // [3]. R | rw 25-04-21 생성
    // [3] 관리자 단건 조회
    public AdminDto findByInfo(String adid) { // fs
        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(adid);
        if (optional.isPresent()) {
            return optional.get().toDto();
        }
        return null;

        // [&] Stream 방식
        /*
        return adminEntityRepository.findByAdid(adid)
                .map(AdminEntity::toDto)
                .orElse(null);
        */
    } // fe

    // [4]. R | rw 25-04-22 생성
    // [4] 관리자 전건 정보 조회
    public List<AdminDto> findAll() { // fs
        List<AdminEntity> adminEntityList = adminEntityRepository.findAll();
        List<AdminDto> adminDtoList = new ArrayList<>();
        for (AdminEntity entity : adminEntityList) {
            adminDtoList.add(entity.toDto());
        }
        return adminDtoList;

        // [&] Stream 방식
        /*
        return adminEntityRepository.findAll()
                .stream()
                .map(AdminEntity::toDto)
                .collect(Collectors.toList());
        */
    } // fe

    // [5]. U | rw 25-04-23 생성
    // [5] 관리자 정보 수정
    public boolean update(AdminDto dto) { // fs
        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(dto.getAdid());
        if (optional.isPresent()) {
            AdminEntity entity = optional.get();
            entity.setAdname(dto.getAdname());
            entity.setAdphone(dto.getAdphone());
            adminEntityRepository.save(entity);
            return true;
        }
        return false;

        // [&] Stream 방식
        /*
        return adminEntityRepository.findByAdid(dto.getAdid())
                .map(entity -> {
                    entity.setAdname(dto.getAdname());
                    entity.setAdphone(dto.getAdphone());
                    adminEntityRepository.save(entity);
                    return true;
                })
                .orElse(false);
        */
    } // fe

    // [6]. D | rw 25-04-23 생성
    // [6] 관리자 삭제 (상태값 변경 방식)
    public boolean delete(String adid) { // fs
        Optional<AdminEntity> optional = adminEntityRepository.findByAdid(adid);
        if (optional.isPresent()) {
            AdminEntity entity = optional.get();
            entity.setAdtype(9); // 예: 9 → 삭제 처리 상태
            adminEntityRepository.save(entity);
            return true;
        }
        return false;

        // [&] Stream 방식
        /*
        return adminEntityRepository.findByAdid(adid)
                .map(entity -> {
                    entity.setAdtype(9);
                    adminEntityRepository.save(entity);
                    return true;
                })
                .orElse(false);
        */
    } // fe

} // CE
