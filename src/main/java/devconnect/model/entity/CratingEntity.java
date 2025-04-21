package devconnect.model.entity;

import devconnect.model.dto.CratingDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table( name = "crating")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CratingEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int crno; // 평가 번호(기업)
    @Column(nullable = false)
    private int crscore; // 점수(기업)
    @Column(nullable = false)
    private String crdate; // 평가일(기업)
    @Column(nullable = false)
    private int dno; // 개발자번호(FK)
    @Column(nullable = false)
    private int cno; // 프로젝트번호(FK)

    // Entity -> Dto
    public CratingDto toDto(){
        return CratingDto.builder()
                .crno( this.crno )
                .crscore( this.crscore )
                .crdate( this.crdate )
                .dno( this.cno )
                .cno( this.cno )
                .build();
    } // dto end
    
} // c end
