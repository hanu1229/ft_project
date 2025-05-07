package devconnect.model.repository;

import devconnect.model.entity.DratingEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface DratingRepository extends JpaRepository<DratingEntity, Integer> {

    // 평가 키워드 검색
    @Query(value = "select d.drno, d.dtitle, d.dcontent, d.drscore, d.drstate, d.pno, d.dno, " +
            "d.create_at, d.update_at " +
            "from drating d " +
            "join project p on d.pno = p.pno " +
            "where (:keyword is null or d.dtitle like %:keyword%) " +
            "and (:cno = 0 or p.cno = :cno)", nativeQuery = true)
    Page<DratingEntity> findBysearch(
            @Param("keyword") String keyword,
            Pageable pageable,
            @Param("cno") int cno
    );

    /// 개발자 전체 평점 구하는 부분
    @Query(value = "select avg(drscore) from devconnect.drating where dno = :dno", nativeQuery = true)
    double findByAvgDno(int dno);

} // interface end
