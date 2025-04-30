package devconnect.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import devconnect.model.entity.CratingEntity;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.entity.ProjectEntity;
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
    private String ctitle; // 평가 제목(기업)
    private String ccontent; // 평가 내용(기업)
    private int crscore; // 점수(기업)
    // LocalDateTime는 밀리초까지 너무 상세하게 나와서 형식을 정해주는 어노테이션
    // 밀리초가 필요한지 논의 후 application.properties에 전체적용할지 정할예정
    @JsonFormat( shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createAt; // 평가일(기업)
    @JsonFormat( shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updateAt; // 수정일(기업)
    private int crstate; // 평가
    private int dno; // 개발자번호(FK)
    private int pno; // 프로젝트번호(FK)
    
    // Dto -> Entity
    public CratingEntity toEntity(ProjectEntity projectEntity , DeveloperEntity developerEntity ){
        return CratingEntity.builder()
                .crno( this.crno )
                .ctitle( this.ctitle )
                .ccontent( this.ccontent )
                .crscore( this.crscore )
                .crstate( this.crstate )
                .projectEntity( projectEntity )
                .developerEntity( developerEntity )
                .build();
    } // entity end

    // toDto : 제품 전체조회
} // c end
