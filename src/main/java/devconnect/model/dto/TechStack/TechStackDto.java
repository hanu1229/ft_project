package devconnect.model.dto.TechStack;

import devconnect.model.entity.TechStackEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data @NoArgsConstructor @AllArgsConstructor
public class TechStackDto {
    private int tsno;
    private String tsname;
    private int tsexp;

    public TechStackEntity toEntity(){
        return TechStackEntity.builder()
                .tsno( this.tsno )
                .tsname( this.tsname )
                .tsexp( this.tsexp )
                .build();
    }
}
