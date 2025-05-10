package devconnect.model.entity;

import devconnect.model.dto.CareerDto;
import jakarta.persistence.*;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder @Entity @Table( name = "career" )
public class CareerEntity extends BaseTime{
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    private int cano;

    @Column( nullable = false )
    private LocalDateTime caStartDate;

    private LocalDateTime caEndDate;

    @ManyToOne
    @JoinColumn( name = "dno" )
    private DeveloperEntity developerEntity;

    public CareerDto toDto(){
        return  CareerDto.builder()
                .cano( this.cano )
                .caStartDate( this.caStartDate )
                .caEndDate( this.caEndDate )
                .dno( this.developerEntity.getDno() )
                .build();
    }

}
