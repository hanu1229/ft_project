package devconnect.model.entity;

import devconnect.model.dto.ProjectJoinDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_join")
@Builder
@NoArgsConstructor @AllArgsConstructor
@Getter
public class ProjectJoinEntity extends BaseTime {

    // 신청 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pjno;
    // 상태
    @Column(nullable = false)
    private int pjtype;
    // 신청 시간
    @Column(nullable = false)
    private String pjtime;
    // 프로젝트 번호
    @ManyToOne
    // @Column(nullable = false)
    private ProjectEntity projectEntity;
    // 개발자 번호
    @Column(nullable = false)
    private int dno;
    
    // 추후 dno를 위한 테이블 연결


    /// Entity --> Dto
    public ProjectJoinDto toDto() {
        return ProjectJoinDto.builder()
                .pjno(this.pjno).pjtype(this.pjtype).pjtime(this.pjtime)
                .pno(projectEntity.getPno()).dno(this.dno)
                .createAt(getCreateAt()).updateAt(getUpdateAt())
                .build();
    }

}
