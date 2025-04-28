package devconnect.model.repository;

import devconnect.model.entity.ProjectImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectImageRepository extends JpaRepository<ProjectImageEntity, Integer> {
}
