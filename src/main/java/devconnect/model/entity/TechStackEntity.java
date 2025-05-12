package devconnect.model.entity;

import devconnect.model.dto.TechStack.TechStackDto;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;


@Entity @Builder @Table( name = "techstack" )
@Data @NoArgsConstructor @AllArgsConstructor
public class TechStackEntity extends BaseTime{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int tsno;

    @Column( length = 30, nullable = false, unique = true )
    private String tsname;

    @Column( nullable = false )
    private int tsexp;

    @OneToMany( mappedBy = "techStackEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY )
    @Builder.Default
    @ToString.Exclude
    private List<TechStackListEntity> techStackListEntityList = new ArrayList<>();

    // 프로젝트 기술스택 조인
    @OneToMany(mappedBy = "techStackEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default @ToString.Exclude
    private List<ProjectTechStackEntity> projectTechStackList = new ArrayList<>();

    public TechStackDto toDto(){
        return TechStackDto.builder()
                .tsno( this.tsno )
                .tsname( this.tsname )
                .tsexp( this.tsexp )
                .build();
    }
}
