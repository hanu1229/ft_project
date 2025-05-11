package devconnect.model.dto;

import devconnect.model.entity.ProjectEntity;
import jakarta.persistence.Column;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Builder
@NoArgsConstructor @AllArgsConstructor
@Getter @Setter @ToString
public class ProjectDto {

    // 프로젝트 번호(PK)
    private int pno;
    // 프로젝트 이름
    private String pname;
    // 소개
    private String pintro;
    // 참여대상
    private int ptype;
    // 설명
    private String pcomment;
    // 모집인원
    private int pcount;
    // 프로젝트 시작일
    private LocalDateTime pstart;
    // 프로젝트 마감일
    private LocalDateTime pend;
    // 모집 시작일
    private LocalDateTime recruit_pstart;
    // 모집 마감일
    private LocalDateTime recruit_pend;
    // 페이
    private int ppay;
    // 현재 모집 상태
    private int recruitment_status;
    // 삭제 상태 | 1이면 삭제
    private int delete_state;
    // 기업 번호(FK)
    private int cno;
    // 기업명
    private String cname;
    // 생성일
    private LocalDateTime createAt;
    // 수정일
    private LocalDateTime updateAt;
    // 회사 로고 이미지
    private String cprofile;
    // 이미지 파일
    private List<MultipartFile> files = new ArrayList<>();
    // 이미지명
    private List<String> images = new ArrayList<>();

    /// Dto --> Entity
    public ProjectEntity toEntity() {
        return ProjectEntity.builder()
                .pno(this.pno).pname(this.pname).pintro(this.pintro).ptype(this.ptype)
                .pcomment(this.pcomment).pcount(this.pcount).pstart(this.pstart).pend(this.pend)
                .recruit_pstart(this.recruit_pstart).recruit_pend(this.recruit_pend).ppay(this.ppay)
                .build();
    }

}
