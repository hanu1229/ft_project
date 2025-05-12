package devconnect.model.dto.TechStack;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data @NoArgsConstructor @AllArgsConstructor
public class ProjectTechStackViewDto {
    private int ptsno;
    private int tsno;
    private String tsname;
}
