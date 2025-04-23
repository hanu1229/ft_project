package devconnect.model.entity;

import devconnect.model.dto.CratingDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

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
    @Column @ColumnDefault( "0" ) // 기본 0
    private int crstate; // 상태

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
                .pno( this.projectEntity.getPno() )
                .dno( this.developerEntity.getDno() )
                .crstate( this.crstate )
                .createAt( this.getCreateAt() )
                .updateAt( this.getUpdateAt() )
                .build();
    } // dto end
    
} // c end
