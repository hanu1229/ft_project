package devconnect.model.repository;

import devconnect.model.entity.DratingEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DratingRepository extends JpaRepository<DratingEntity, Integer> {

} // interface end
