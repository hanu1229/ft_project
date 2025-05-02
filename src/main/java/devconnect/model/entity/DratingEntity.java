package devconnect.model.entity;

import devconnect.model.dto.DratingDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

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
    private String dtitle; // 평가 제목
    @Column( nullable = false )
    private String dcontent; // 평가 내용
    @Column( nullable = false )
    private int drscore; // (개발자)점수
    @Column @ColumnDefault( "0" ) // 기본 0
    private int drstate; // 상태

    @ManyToOne @JoinColumn( name = "pno" )
    private ProjectEntity projectEntity;

    @ManyToOne @JoinColumn( name = "dno" )
    private DeveloperEntity developerEntity;

    // Entity -> Dto
    public DratingDto toDto(){
        return DratingDto.builder()
                .drno( this.drno )
                .dtitle( this.dtitle )
                .dcontent( this.dcontent )
                .drscore( this.drscore )
                .pno( this.projectEntity.getPno() )
                .dno( this.developerEntity.getDno() )
                .drstate( this.drstate )
                .createAt( this.getCreateAt() )
                .updateAt( this.getUpdateAt() )
                .build();
    } // dto end
    
} // c end
