package devconnect.model.entity;

import devconnect.model.dto.CratingDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table( name = "crating")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CratingEntity extends BaseTime { // "회사"를 개발자가 평가
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int crno; // 평가 번호(기업)
    @Column(nullable = false)
    private int crscore; // 점수(기업)
//    @Column(nullable = false)
//    private String crdate; // 평가일(기업)


    @ManyToOne
    @JoinColumn (name = "pno")
    private ProjectEntity projectEntity;

    @ManyToOne
    @JoinColumn (name = "dno")
    private DeveloperEntity developerEntity;

    // Entity -> Dto
    public CratingDto toDto(){
        return CratingDto.builder()
                .crno( this.crno )
                .crscore( this.crscore )
                .pno( projectEntity.getPno() )
                .dno( developerEntity.getDno() )
                .build();
    } // dto end
    
} // c end
