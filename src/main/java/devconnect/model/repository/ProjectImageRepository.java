package devconnect.model.repository;

import devconnect.model.entity.ProjectImageEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectImageRepository extends JpaRepository<ProjectImageEntity, Integer> {

    @Query(value = "select * from project_image where pno = :pno", nativeQuery = true)
    List<ProjectImageEntity> findByPno(int pno);

}
