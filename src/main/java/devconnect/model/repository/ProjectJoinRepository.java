package devconnect.model.repository;

import devconnect.model.entity.ProjectEntity;
import devconnect.model.entity.ProjectJoinEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectJoinRepository extends JpaRepository<ProjectJoinEntity, Integer> {
    @Query("SELECT pj FROM ProjectJoinEntity pj " +
            "JOIN FETCH pj.projectEntity p " +
            "WHERE (:logInDno IS NULL OR :logInDno = 0 OR pj.developerEntity.dno = :logInDno) " +
            "AND (:keyword IS NULL OR p.pname LIKE %:keyword%)")
    Page< ProjectJoinEntity > findBySearch(int logInDno, String keyword, Pageable pageable );

    List<ProjectJoinEntity> findByProjectEntity(ProjectEntity projectEntity);

    @Query(
            value = "select * from project_join where pno = :pno",
            countQuery = "select count(*) from project_join where pno = :pno",
            nativeQuery = true
    )
    Page<ProjectJoinEntity> findByPnoJoin(@Param("pno") int pno, Pageable pageable);

    @Query("select pj.developerEntity.dno from ProjectJoinEntity pj where pj.projectEntity.pno = :pno")
    List<Integer> findDnoByPno( @Param("pno") int pno );
}
