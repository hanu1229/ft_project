package devconnect.model.entity;

import devconnect.model.dto.CratingDto;
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
@Table( name = "crating")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CratingEntity extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int crno; // 평가 번호(기업)
    @Column(nullable = false)
    private int crscore; // 점수(기업)
    @Column(nullable = false , updatable = false)
    private LocalDateTime crdate; // 평가일(기업)
    @Column(nullable = false)
    private int dno; // 개발자번호(FK)
    @Column(nullable = false)
    private int pno; // 프로젝트번호(FK)

    // 현재 날짜,시간 자동 주입
    @PrePersist
    protected void onCreate(){
        this.crdate = LocalDateTime.now();
    } // f end

    // Entity -> Dto
    public CratingDto toDto(){
        return CratingDto.builder()
                .crno( this.crno )
                .crscore( this.crscore )
                .crdate( this.crdate )
                .dno( this.dno )
                .pno( this.pno )
                .createAt( this.getCreateAt() )
                .updateAt( this.getUpdateAt() )
                .build();
    } // dto end
    
} // c end
