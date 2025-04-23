package devconnect.model.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.entity.DratingEntity;
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
public class DratingDto {
    private int drno; // 평가 번호(개발자)
    private int drscore; // 점수(개발자)
    @JsonFormat( shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime createAt; // 평가일(개발자)
    @JsonFormat( shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime updateAt; // 수정일(개발자)
    private int drstate; // 평가
    private int pno; // 프로젝트 번호(FK)
    private int dno; // 개발자 번호(FK)

    // Dto -> Entity
    public DratingEntity toEntity(ProjectEntity projectEntity , DeveloperEntity developerEntity){
        return DratingEntity.builder()
                .drno( this.drno )
                .drscore( this.drscore )
                .drstate( this.drstate )
                .projectEntity(projectEntity)
                .developerEntity(developerEntity)
                .build();
    } // entity end

} // c end
