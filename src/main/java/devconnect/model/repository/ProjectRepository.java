package devconnect.model.repository;

import devconnect.model.entity.ProjectEntity;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Integer> {

    /// ● 직무에 따른 페이징
   

    /// ● 기업별 프로젝트 출력을 위한 함수
    List<ProjectEntity> findAllByCompanyEntity_cno(int cno);

    // 페이징 - 직무 전체

    /// ● 페이징 - 모집기간 : 전체, 직무 : 전체
    Page<ProjectEntity> findAll(Pageable pageable);

    /// ● 페이징 - 모집기간 : 모집 전, 직무 : 전체
    @Query(
            value = "select * from project where recruit_pstart > :today",
            countQuery = "select count(*) from project where recruit_pstart > :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByBefore(@Param("today") String today, Pageable pageable);

    /// ● 페이징 - 모집기간 : 모집 중, 직무 : 전체
    @Query(
            value = "select * from project where recruit_pstart <= :today and recruit_pend > :today",
            countQuery = "select count(*) from project where recruit_pstart <= :today and recruit_pend > :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByIng(@Param("today") String today, Pageable pageable);

    /// ● 페이징 - 모집기간 : 모집 후, 직무 : 전체
    @Query(
            value = "select * from project where recruit_pend <= :today",
            countQuery = "select count(*) from project where recruit_pend <= :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByAfter(@Param("today") String today, Pageable pageable);

    // 페이징 - 직무 : 전체

    // 페이징 - 직무 : 선택

    /// ● 페이징 - 모집기간 : 전체, 직무 : 선택
    @Query(
            value = "select * from project where ptype = :ptype",
            countQuery = "select count(*) from project where ptype = :ptype",
            nativeQuery = true
    )
    Page<ProjectEntity> findByPtype(@Param("ptype") Integer ptype, Pageable pageable);

    /// ● 페이징 - 모집기간 : 모집 전, 직무 : 선택
    @Query(
            value = "select * from project where ptype = :ptype and recruit_pstart > :today",
            countQuery = "select count(*) from project where ptype = :ptype and recruit_pstart > :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByBefore(@Param("ptype") Integer ptype, @Param("today") String today, Pageable pageable);

    /// ● 페이징 - 모집기간 : 모집 중, 직무 : 선택
    @Query(
            value = "select * from project where ptype = :ptype and recruit_pstart <= :today and recruit_pend > :today",
            countQuery = "select count(*) from project where ptype = :ptype and recruit_pstart <= :today and recruit_pend > :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByIng(@Param("ptype") Integer ptype, @Param("today") String today, Pageable pageable);

    /// ● 페이징 - 모집기간 : 모집 후, 직무 : 선택
    @Query(
            value = "select * from project where ptype = :ptype and recruit_pend <= :today",
            countQuery = "select count(*) from project where ptype = :ptype and recruit_pend <= :today",
            nativeQuery = true
    )
    Page<ProjectEntity> findByAfter(@Param("ptype") Integer ptype, @Param("today") String today, Pageable pageable);

    // 페이징 - 직무 : 선택

}
