/*  AdminEntityRepository 인터페이스 | rw 25-04-19 생성
    - AdminEntity 전용 JPA 인터페이스입니다.
    - 관리자 ID(adid) 기반 단건 조회 기능을 제공합니다.
    - 로그인, 관리자 중복 검사 등에 사용됩니다.
*/

package devconnect.model.repository;

import devconnect.model.entity.AdminEntity;
import org.springframework.data.jpa.repository.JpaRepository; // [A] Spring Data JPA 기능 사용 (기본 CRUD 제공)
import org.springframework.stereotype.Repository; // [B] 이 인터페이스가 Repository 컴포넌트임을 명시


@Repository // [D] 스프링 빈 등록 (자동 감지)
public interface AdminEntityRepository extends JpaRepository<AdminEntity, Integer> { // CS

    // =======================================================================================
    // [1] 관리자 ID로 단건 조회 (로그인 등에서 사용)
    AdminEntity findByAdid(String adid);

} // CE