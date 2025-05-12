package devconnect.model.dto;

import devconnect.model.entity.CareerEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Builder
@Data @NoArgsConstructor @AllArgsConstructor
public class CareerDto {
    private int cano;
    private String cacompany;
    private LocalDate caStartDate;
    private LocalDate caEndDate;
    private int dno;

    public CareerEntity toEntity(){
        return CareerEntity.builder()
                .cano( this.cano )
                .cacompany( this.cacompany )
                .caStartDate( this.caStartDate )
                .caEndDate( this.caEndDate )
                .build();
    }

}
