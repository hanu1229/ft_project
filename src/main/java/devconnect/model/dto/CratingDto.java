package devconnect.model.dto;

import devconnect.model.entity.CratingEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CratingDto {
    private int crno; // 평가 번호(기업)
    private int crscore; // 점수(기업)
    private LocalDateTime crdate; // 평가일(기업)
    private int dno; // 개발자번호(FK)
    private int pno; // 프로젝트번호(FK)
    private LocalDateTime createAt; // 등록날짜
    private LocalDateTime updateAt; // 수정날짜
    
    // Dto -> Entity
    public CratingEntity toEntity(){
        return CratingEntity.builder()
                .crno( this.crno )
                .crscore( this.crscore )
                .crdate( this.crdate )
                .dno( this.dno )
                .pno( this.pno )
                .build();
    } // entity end
} // c end
