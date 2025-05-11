package devconnect.model.entity;


import devconnect.model.dto.ProjectDto;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
    @Column(nullable = false, length = 50)
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
    // 삭제 상태 | 1이면 삭제
    @Column(nullable = false)
    @ColumnDefault("0")
    private int delete_state;
    // 기업 번호(FK)
    @ManyToOne
    @JoinColumn(name = "cno")
    private CompanyEntity companyEntity;
    // 양방향 | 프로젝트 신청 테이블
    @OneToMany(mappedBy = "projectEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default @ToString.Exclude
    private List<ProjectJoinEntity> projectJoinEntityList = new ArrayList<>();

    @OneToMany( mappedBy = "projectEntity" , cascade = CascadeType.ALL , fetch = FetchType.LAZY )
    @Builder.Default @ToString.Exclude
    private List<DratingEntity> dratingEntityList = new ArrayList<>();

    @OneToMany( mappedBy = "projectEntity" , cascade = CascadeType.ALL , fetch = FetchType.LAZY )
    @Builder.Default @ToString.Exclude
    private List<CratingEntity> cratingEntityList = new ArrayList<>();

    @OneToMany(mappedBy = "projectEntity", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default @ToString.Exclude
    private List<ProjectImageEntity> projectImageEntityList = new ArrayList<>();

    /// Entity --> Dto
    public ProjectDto toDto() {
        return ProjectDto.builder()
                .pno(this.pno).pname(this.pname).pintro(this.pintro).ptype(this.ptype)
                .pcomment(this.pcomment).pcount(this.pcount).pstart(this.pstart).pend(this.pend)
                .recruit_pstart(this.recruit_pstart).recruit_pend(this.recruit_pend).ppay(this.ppay).cno(companyEntity.getCno())
                .images(projectImageEntityList.stream().map(ProjectImageEntity::getIname).collect(Collectors.toList()))
                .delete_state(delete_state)
                .createAt(getCreateAt()).updateAt(getUpdateAt())
                .build();
    }

}
