package devconnect.model.repository;

import devconnect.model.entity.ProjectJoinEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectJoinRepository extends JpaRepository<ProjectJoinEntity, Integer> {
}
