package devconnect.model.entity;

import devconnect.model.dto.TechStack.TechStackListDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity @Builder @Table( name = "techstacklist")
@Data @NoArgsConstructor @AllArgsConstructor
public class TechStackListEntity extends BaseTime{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int tslno;

    @ManyToOne
    @JoinColumn( name = "dno" )
    private DeveloperEntity developerEntity;

    @ManyToOne
    @JoinColumn( name = "tsno" )
    private TechStackEntity techStackEntity;

    public TechStackListDto toDto(){
        return TechStackListDto.builder()
                .tslno( this.tslno )
                .dno( this.developerEntity.getDno() )
                .tsno( this.techStackEntity.getTsno() )
                .createAt( this.getCreateAt() )
                .updateAt( this.getUpdateAt() )
                .build();
    }

}
