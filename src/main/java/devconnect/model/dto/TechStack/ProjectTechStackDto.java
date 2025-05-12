package devconnect.model.dto.TechStack;

import devconnect.model.entity.ProjectTechStackEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data @NoArgsConstructor @AllArgsConstructor
public class ProjectTechStackDto {
    private int ptsno;
    private int pno;
    private int tsno;

    public ProjectTechStackEntity toEntity(){
        return ProjectTechStackEntity.builder()
                .ptsno( this.ptsno )
                .build();
    }

}
