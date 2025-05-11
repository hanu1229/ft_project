package devconnect.model.repository;

import devconnect.model.entity.DeveloperEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeveloperRepository extends JpaRepository< DeveloperEntity, Integer > {
    // 1. 아이디 조회
    DeveloperEntity findByDid( String did );
    DeveloperEntity findByDno( int dno );

    // 레벨별 랭킹 조회
    @Query( value = "SELECT * FROM developer ORDER BY dlevel DESC, dcurrentexp DESC", nativeQuery = true )
    Page<DeveloperEntity> findBySearch( Pageable pageable );

    @Query(value = "SELECT dno, dname FROM developer WHERE dno IN (:dnoList)", nativeQuery = true)
    List<Object[]> findDnoAndDnameByDnoList(@org.springframework.data.repository.query.Param("dnoList") List<Integer> dnoList);
}
