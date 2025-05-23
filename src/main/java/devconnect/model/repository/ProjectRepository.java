package devconnect.model.repository;

import devconnect.model.entity.ProjectEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Integer> {

    /// ● 기업별 프로젝트 출력을 위한 함수
    List<ProjectEntity> findAllByCompanyEntity_cno(int cno);

    // 페이징 - 직무 전체
    /// ● 페이징 - 모집기간 : 전체, 직무 : 전체
    @Query(
            value = "select * from project where pname like concat('%', :keyword, '%') order by pno desc",
            countQuery = "select count(*) from project where pname like concat('%', :keyword, '%')",
            nativeQuery = true
    )
    Page<ProjectEntity> findAll(@Param("keyword") String keyword, Pageable pageable);
    /// ● 페이징 - 모집기간 : 모집 전, 직무 : 전체
    @Query(
            value = "select * from project where pname like concat('%', :keyword, '%') and recruit_pstart > :today order by pno desc",
            countQuery = "select count(*) from project where pname like concat('%', :keyword, '%') and recruit_pstart > :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByBefore(@Param("keyword") String keyword, @Param("today") String today, Pageable pageable);
    /// ● 페이징 - 모집기간 : 모집 중, 직무 : 전체
    @Query(
            value = "select * from project where pname like concat('%', :keyword, '%') and recruit_pstart <= :today and recruit_pend > :today order by pno desc",
            countQuery = "select count(*) from project where pname like concat('%', :keyword, '%') and recruit_pstart <= :today and recruit_pend > :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByIng(@Param("keyword") String keyword, @Param("today") String today, Pageable pageable);
    /// ● 페이징 - 모집기간 : 모집 완료, 직무 : 전체
    @Query(
            value = "select * from project where pname like concat('%', :keyword, '%') and recruit_pend <= :today order by pno desc",
            countQuery = "select count(*) from project where pname like concat('%', :keyword, '%') and recruit_pend <= :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByAfter(@Param("keyword") String keyword, @Param("today") String today, Pageable pageable);
    // 페이징 - 직무 : 전체
    // 페이징 - 직무 : 선택
    /// ● 페이징 - 모집기간 : 전체, 직무 : 선택
    @Query(
            value = "select * from project where pname like concat('%', :keyword, '%') and ptype = :ptype order by pno desc",
            countQuery = "select count(*) from project where pname like concat('%', :keyword, '%') and ptype = :ptype",
            nativeQuery = true
    )
    Page<ProjectEntity> findByPtype(@Param("keyword") String keyword, @Param("ptype") Integer ptype, Pageable pageable);
    /// ● 페이징 - 모집기간 : 모집 전, 직무 : 선택
    @Query(
            value = "select * from project where pname like concat('%', :keyword, '%') and ptype = :ptype and recruit_pstart > :today order by pno desc",
            countQuery = "select count(*) from project where pname like concat('%', :keyword, '%') and ptype = :ptype and recruit_pstart > :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByBefore(@Param("keyword") String keyword, @Param("ptype") Integer ptype, @Param("today") String today, Pageable pageable);
    /// ● 페이징 - 모집기간 : 모집 중, 직무 : 선택
    @Query(
            value = "select * from project where pname like concat('%', :keyword, '%') and ptype = :ptype and recruit_pstart <= :today and recruit_pend > :today order by pno desc",
            countQuery = "select count(*) from project where pname like concat('%', :keyword, '%') and ptype = :ptype and recruit_pstart <= :today and recruit_pend > :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByIng(@Param("keyword") String keyword, @Param("ptype") Integer ptype, @Param("today") String today, Pageable pageable);
    /// ● 페이징 - 모집기간 : 모집 완료, 직무 : 선택
    @Query(
            value = "select * from project where pname like concat('%', :keyword, '%') and ptype = :ptype and recruit_pend <= :today order by pno desc",
            countQuery = "select count(*) from project where pname like concat('%', :keyword, '%') and ptype = :ptype and recruit_pend <= :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByAfter(@Param("keyword") String keyword, @Param("ptype") Integer ptype, @Param("today") String today, Pageable pageable);
    // 페이징 - 직무 : 선택

}
