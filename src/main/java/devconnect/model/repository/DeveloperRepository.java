package devconnect.model.repository;

import devconnect.model.entity.DeveloperEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeveloperRepository extends JpaRepository< DeveloperEntity, Integer > {
    // 1. 아이디 조회
    DeveloperEntity findByDid( String did );
}
