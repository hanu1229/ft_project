package devconnect.model.entity;

import devconnect.model.dto.CareerDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Builder @Entity @Table( name = "career" )
@Data @NoArgsConstructor @AllArgsConstructor
public class CareerEntity extends BaseTime{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int cano;

    @Column( nullable = false, length = 100 )
    private String cacompany;

    @Column( nullable = false )
    private LocalDate caStartDate;

    private LocalDate caEndDate;

    @ManyToOne
    @JoinColumn( name = "dno" )
    private DeveloperEntity developerEntity;

    public CareerDto toDto(){
        return  CareerDto.builder()
                .cano( this.cano )
                .cacompany( this.cacompany )
                .caStartDate( this.caStartDate )
                .caEndDate( this.caEndDate )
                .dno( this.developerEntity.getDno() )
                .build();
    }

}
