package devconnect.model.repository;

import devconnect.model.entity.DratingEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DratingRepository extends JpaRepository<DratingEntity, Integer> {

    // 평가 키워드 검색
    @Query( value = "select * from drating " +
            " where ( :keyword is null or dtitle like %:keyword% ) " +
            " and ( :dno = 0 or dno = :dno ) " , nativeQuery = true )
    Page<DratingEntity> findBysearch(String keyword , Pageable pageable , int dno );

} // interface end
