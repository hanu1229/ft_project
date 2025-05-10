package devconnect.model.repository;

import devconnect.model.entity.TechStackListEntity;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface TechStackListRepository extends JpaRepository<TechStackListEntity, Integer> {
    // 1. 로그인된 기술스택 삭제
//    @Modifying
//    @Query( value = "DELETE FROM techstacklist where dno = :logInDno", nativeQuery = true )
//    void deleteByDno( int logInDno );
    void deleteByDeveloperEntity_Dno(int dno);
}
