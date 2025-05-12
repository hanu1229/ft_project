package devconnect.model.entity;

import devconnect.model.dto.TechStack.ProjectTechStackDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Builder @Table( name = "projecttechstack" )
@Data @NoArgsConstructor @AllArgsConstructor
public class ProjectTechStackEntity {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int ptsno;

    @ManyToOne
    @JoinColumn( name = "pno" )
    private ProjectEntity projectEntity;

    @ManyToOne
    @JoinColumn( name = "tsno" )
    private TechStackEntity techStackEntity;

    public ProjectTechStackDto toDto(){
        return ProjectTechStackDto.builder()
                .ptsno( this.ptsno )
                .pno( this.projectEntity.getPno() )
                .tsno( this.techStackEntity.getTsno() )
                .build();
    }

}
