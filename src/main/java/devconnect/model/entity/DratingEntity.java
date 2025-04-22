package devconnect.model.entity;

import devconnect.model.dto.DratingDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table( name = "drating")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DratingEntity extends BaseTime { // "개발자"를 회사가 평가
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int drno; // 평가 번호(개발자)
    @Column(nullable = false)
    private int drscore; // (개발자)점수
//    @Column(nullable = false)
//    private String drdate; // 평가일(개발자)

    @ManyToOne @JoinColumn( name = "pno" )
    private ProjectEntity projectEntity;

    @ManyToOne @JoinColumn( name = "dno" )
    private DeveloperEntity developerEntity;

    // Entity -> Dto
    public DratingDto toDto(){
        return DratingDto.builder()
                .drno( this.drno )
                .drscore( this.drscore )
                .pno( projectEntity.getPno() )
                .dno( developerEntity.getDno() )
                .createAt( this.getCreateAt() )
                .updateAt( this.getUpdateAt() )
                .build();
    } // dto end
    
} // c end
