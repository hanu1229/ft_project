package devconnect.model.dto;

import devconnect.model.entity.ProjectImageEntity;
import lombok.*;

@Builder
@NoArgsConstructor @AllArgsConstructor
@Getter @Setter @ToString
public class ProjectImageDto {

    // 이미지번호
    private int ino;
    // 이미지명
    private String iname;
    // 프로젝트번호(FK)
    private int pno;

    /// Dto --> Entity
    public ProjectImageEntity toEntity() {
        return ProjectImageEntity.builder()
                .ino(this.ino).iname(this.iname)
                .build();
    }

}
