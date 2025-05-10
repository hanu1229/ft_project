package devconnect.model.dto;

import devconnect.model.entity.CareerEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data @NoArgsConstructor @AllArgsConstructor
public class CareerDto {
    private int cano;
    private LocalDateTime caStartDate;
    private LocalDateTime caEndDate;
    private int dno;

    public CareerEntity toEntity(){
        return CareerEntity.builder()
                .cano( this.cano )
                .caStartDate( this.caStartDate )
                .caEndDate( this.caEndDate )
                .build();
    }

}
