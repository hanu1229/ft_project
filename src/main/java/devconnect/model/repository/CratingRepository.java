package devconnect.model.repository;

import devconnect.model.entity.CratingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CratingRepository extends JpaRepository<CratingEntity, Integer > {

} // interface end
