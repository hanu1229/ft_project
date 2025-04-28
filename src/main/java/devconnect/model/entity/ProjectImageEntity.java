package devconnect.model.entity;

import devconnect.model.dto.ProjectImageDto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "project_image")
@Builder
@NoArgsConstructor @AllArgsConstructor
@Getter @Setter @ToString
public class ProjectImageEntity {

    // 이미지번호
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int ino;
    // 이미지명
    @Column(nullable = false)
    private String iname;
    // 프로젝트번호(FK)
    @ManyToOne()
    @JoinColumn(name = "pno")
    private ProjectEntity projectEntity;

    /// Entity --> Dto
    public ProjectImageDto toDto() {
        return ProjectImageDto.builder()
                .ino(this.ino).iname(this.iname).pno(projectEntity.getPno())
                .build();
    }

}
