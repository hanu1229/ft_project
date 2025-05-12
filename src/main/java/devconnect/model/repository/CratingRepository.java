package devconnect.model.repository;

import devconnect.model.entity.CratingEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CratingRepository extends JpaRepository<CratingEntity, Integer > {

    // 평가 키워드 검색
    @Query( value = "select * from crating " +
            " where ( :keyword is null or ctitle like %:keyword% ) " +
            " and ( crstate = 1 )" +
            " and ( :dno = 0 or dno = :dno ) " , nativeQuery = true )
    Page<CratingEntity> findBySearch(String keyword , Pageable pageable , int dno );

} // interface end
