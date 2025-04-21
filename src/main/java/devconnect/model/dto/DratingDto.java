package devconnect.model.dto;

import devconnect.model.entity.DratingEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DratingDto {
    private int drno; // 평가 번호(개발자)
    private int drscore; // 점수(개발자)
    private LocalDateTime drdate; // 평가일(개발자)
    private int pno; // 프로젝트 번호(FK)
    private int dno; // 개발자 번호(FK)
    private LocalDateTime createAt; // 등록날짜
    private LocalDateTime updateAt; // 수정날짜

    // Dto -> Entity
    public DratingEntity toEntity(){
        return DratingEntity.builder()
                .drno( this.drno )
                .drscore( this.drscore )
                .pno( this.pno )
                .dno( this.dno )
                .build();
    } // entity end

} // c end
