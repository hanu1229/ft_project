package devconnect.model.repository;

import devconnect.model.entity.ProjectJoinEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectJoinRepository extends JpaRepository<ProjectJoinEntity, Integer> {
    @Query("SELECT pj FROM ProjectJoinEntity pj " +
            "JOIN FETCH pj.projectEntity p " +
            "WHERE (:logInDno IS NULL OR :logInDno = 0 OR pj.developerEntity.dno = :logInDno) " +
            "AND (:keyword IS NULL OR p.pname LIKE %:keyword%)")
    Page< ProjectJoinEntity > findBySearch(int logInDno, String keyword, Pageable pageable );
}
