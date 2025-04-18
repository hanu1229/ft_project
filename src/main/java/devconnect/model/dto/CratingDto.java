package devconnect.model.dto;

import devconnect.model.entity.CratingEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CratingDto {
    private int crno; // 평가 번호(기업)
    private int crscore; // 점수(기업)
    private String crdate; // 평가일(기업)
    private int dno; // 개발자번호(FK)
    private int cno; // 프로젝트번호(FK)
    
    // Dto -> Entity
    public CratingEntity toEntity(){
        return CratingEntity.builder()
                .crno( this.crno )
                .crscore( this.crscore )
                .crdate( this.crdate )
                .dno( this.dno )
                .cno( this.cno )
                .build();
    } // entity end
} // c end
