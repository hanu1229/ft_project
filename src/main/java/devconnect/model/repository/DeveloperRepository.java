package devconnect.model.repository;

import devconnect.model.entity.DeveloperEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeveloperRepository extends JpaRepository< DeveloperEntity, Integer > {
}
