package devconnect.model.repository;

import devconnect.model.entity.ProjectEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<ProjectEntity, Integer> {

    /// ● 무한 스크롤을 위한 페이징
    Page<ProjectEntity> findAll(Pageable pageable);

    /// ● 기업별 프로젝트 출력을 위한 함수
    List<ProjectEntity> findAllByCompanyEntity_cno(int cno);

}
