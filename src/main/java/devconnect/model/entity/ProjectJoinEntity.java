package devconnect.model.entity;

import devconnect.model.dto.ProjectDto;
import devconnect.model.dto.ProjectJoinDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import org.hibernate.annotations.ColumnDefault;

@Entity
@Table(name = "project_join")
@Builder
@NoArgsConstructor @AllArgsConstructor
@Getter @Setter @ToString
public class ProjectJoinEntity extends BaseTime {

    // 신청 번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pjno;
    // 상태
    @Column(nullable = false)
    @ColumnDefault("0")
    private int pjtype;
    // 신청 시간
    // @Column(nullable = false)
    // private String pjtime;

    // 프로젝트 번호 (FK)
    @ManyToOne
    @JoinColumn(name = "pno")
    private ProjectEntity projectEntity;
    // 개발자 번호 (FK)
    @ManyToOne
    @JoinColumn(name = "dno")
    private DeveloperEntity developerEntity;

    /// Entity --> Dto
    public ProjectJoinDto toDto() {
        return ProjectJoinDto.builder()
                .pjno(this.pjno).pjtype(this.pjtype)
                .pno(projectEntity.getPno()).pname(projectEntity.getPname())
                .dno(developerEntity.getDno()).dname(developerEntity.getDname()).dlevel(developerEntity.getDlevel())
                .createAt(getCreateAt()).updateAt(getUpdateAt())
                .build();
    }

    public ProjectJoinDto toFindAllDto() {
        return ProjectJoinDto.builder()
                .pjno(this.pjno).pjtype(this.pjtype)
                .pno(projectEntity.getPno()).dno(developerEntity.getDno())
                .createAt(getCreateAt()).updateAt(getUpdateAt())
                .project(projectEntity.toDto())
                .build();
    }

}
