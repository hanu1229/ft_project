package devconnect.model.entity;


import devconnect.model.dto.ProjectDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "project")
@Builder
@NoArgsConstructor @AllArgsConstructor
@Getter @Setter @ToString
public class ProjectEntity extends BaseTime {

    // 프로젝트 번호(PK)
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int pno;
    // 프로젝트 이름
    @Column(nullable = false, length = 30)
    private String pname;
    // 소개
    @Column(nullable = false)
    private String pintro;
    // 참여대상
    @Column(nullable = false)
    private int ptype;
    // 설명
    @Column(nullable = false, length = 10000)
    private String pcomment;
    // 모집인원
    @Column(nullable = false)
    private int pcount;
    // 프로젝트 시작일
    @Column(nullable = false)
    private LocalDateTime pstart;
    // 프로젝트 마감일
    @Column(nullable = false)
    private LocalDateTime pend;
    // 모집 시작일
    @Column(nullable = false)
    private LocalDateTime recruit_pstart;
    // 모집 마감일
    @Column(nullable = false)
    private LocalDateTime recruit_pend;
    // 페이
    @Column(nullable = false)
    private int ppay;
    // 기업 번호(FK)
    @Column(nullable = false)
    private int cno;
    
    // 추후 cno를 위한 company 테이블 연결

    // 양방향 연결
    @OneToMany(mappedBy = "pno", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ProjectJoinEntity> projectJoinEntityList = new ArrayList<>();

    /// Entity --> Dto
    public ProjectDto toDto() {
        return ProjectDto.builder()
                .pno(this.pno).pname(this.pname).pintro(this.pintro).ptype(this.ptype)
                .pcomment(this.pcomment).pcount(this.pcount).pstart(this.pstart).pend(this.pend)
                .recruit_pstart(this.recruit_pstart).recruit_pend(this.recruit_pend).ppay(this.ppay).cno(this.cno)
                .createAt(getCreateAt()).updateAt(getUpdateAt())
                .build();
    }

}
