package devconnect.model.repository;

import devconnect.model.entity.CompanyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity, Integer> {

    // id 찾는 추상메소드
    CompanyEntity findByCid(String cid);

    @Query(value = "SELECT cno, cname FROM company WHERE cno IN (:cnoList)", nativeQuery = true)
    List<Object[]> findCnoAndCnameByCnoList(@org.springframework.data.repository.query.Param("cnoList") List<Integer> cnoList);
}
