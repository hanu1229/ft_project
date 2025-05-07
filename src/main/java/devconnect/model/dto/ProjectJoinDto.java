package devconnect.model.dto;

import devconnect.model.entity.ProjectJoinEntity;
import lombok.*;

import java.time.LocalDateTime;

@Builder
@NoArgsConstructor @AllArgsConstructor
@Getter @Setter @ToString
public class ProjectJoinDto {

    // 신청 번호
    private int pjno;
    // 상태
    private int pjtype;
    // 신청 시간
    // private String pjtime;
    // 프로젝트 이름
    private String pname;
    // 개발자 이름
    private String dname;
    // 개발자 레벨
    private int dlevel;
    // 개발자 평점
    private double davg;
    // 프로젝트 번호
    private int pno;
    // 개발자 번호
    private int dno;
    // 생성일
    private LocalDateTime createAt;
    // 수정일
    private LocalDateTime updateAt;

    // join 정보 가져오기
    private ProjectDto project;

    /// Dto --> Entity
    public ProjectJoinEntity toEntity() {
        return ProjectJoinEntity.builder()
                .pjno(this.pjno)
                .pjtype(this.pjtype)
                .build();
    }

}
