/*
 * AdminEntityRepository 인터페이스 | rw 25-04-19 생성
 * - AdminEntity 전용 JPA 인터페이스
 * - 관리자 ID(adid) 기반 단건 조회 기능 포함
 * - 로그인 및 관리자 중복 검사 등에 사용
*/

package devconnect.model.repository;

import devconnect.model.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminEntityRepository extends JpaRepository<AdminEntity, Integer> { // CS

    // [1] 관리자 ID로 단건 조회 (로그인 등에서 사용됨)
    Optional<AdminEntity> findByAdid(String adid);

} // CE