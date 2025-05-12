package devconnect.model.repository;

import devconnect.model.entity.ProjectTechStackEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectTechStackRepository extends JpaRepository<ProjectTechStackEntity, Integer> {
    // 1. 프로젝트 기술 스택 삭제
    void deleteByProjectEntity_Pno( int pno );
}
