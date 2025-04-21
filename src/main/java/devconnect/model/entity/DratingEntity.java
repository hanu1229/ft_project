package devconnect.model.entity;

import devconnect.model.dto.DratingDto;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table( name = "drating")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DratingEntity extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int drno; // 평가 번호(개발자)
    @Column(nullable = false)
    private int drscore; // (개발자)점수
    @Column(nullable = false , updatable = false)
    private LocalDateTime drdate; // 평가일(개발자)
    @Column(nullable = false)
    private int pno; // 프로젝트 번호(FK)
    @Column(nullable = false)
    private int dno; // 개발자 번호(FK)

    // 현재 날짜,시간 자동 주입
    @PrePersist
    protected void onCreate(){
        this.drdate = LocalDateTime.now();
    } // f end

    // Entity -> Dto
    public DratingDto toDto(){
        return DratingDto.builder()
                .drno( this.drno )
                .drscore( this.drscore )
                .drdate( this.drdate )
                .pno( this.dno )
                .dno( this.dno )
                .createAt( this.getCreateAt() )
                .updateAt( this.getUpdateAt() )
                .build();
    } // dto end
    
} // c end
