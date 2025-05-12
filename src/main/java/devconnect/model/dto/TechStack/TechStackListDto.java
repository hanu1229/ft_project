package devconnect.model.dto.TechStack;

import devconnect.model.entity.TechStackListEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Builder
@Data @NoArgsConstructor @AllArgsConstructor
public class TechStackListDto {
    private int tslno;
    private int dno;
    private int tsno;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    public TechStackListEntity toEntity(){
        return TechStackListEntity.builder()
                .tslno( this.tslno )
                .build();
    }

}
