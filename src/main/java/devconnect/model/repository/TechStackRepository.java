package devconnect.model.repository;

import devconnect.model.entity.TechStackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TechStackRepository extends JpaRepository<TechStackEntity, Integer> {
}
