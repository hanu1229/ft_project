package devconnect.model.repository;

import devconnect.model.entity.CompanyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CompanyRepository extends JpaRepository<CompanyEntity, Integer> {

    // id 찾는 추상메소드
    CompanyEntity findByCid(String cid);

}
