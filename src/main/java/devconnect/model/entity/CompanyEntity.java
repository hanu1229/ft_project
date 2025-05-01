package devconnect.model.entity;

import devconnect.model.dto.CompanyDto;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.web.multipart.MultipartFile;

@Entity
@Table(name = "company" )
@Data@Builder
@NoArgsConstructor@AllArgsConstructor
public class CompanyEntity extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int cno;

    @Column(nullable = false , unique = true)
    private String cid;
    @Column(nullable = false)
    private String cpwd;
    @Column(nullable = false , unique = true)
    private String cname; // 기업명
    @Column(nullable = false)
    private String cphone;
    @Column(nullable = false )
    private String cadress; // 주소
    @Column(nullable = false)
    private String cemail;
    @Column(nullable = false , unique = true)
    private String cbusiness; // 사업자 번호
    @Column
    private String cprofile; // jpg파일
    @Column
    @ColumnDefault("0")
    private int state;

    @OneToMany(mappedBy = "companyEntity" , cascade = CascadeType.ALL , fetch = FetchType.LAZY)
    @ToString.Exclude@Builder.Default
    private List<ProjectEntity> projectEntityList = new ArrayList<>();

    public CompanyDto toDto(){
        return CompanyDto.builder()
                .cno(cno)
                .cid(cid)
                .cpwd(cpwd)
                .cname(cname)
                .cphone(cphone)
                .cadress(cadress)
                .cemail(cemail)
                .cbusiness(cbusiness)
                .state(state)
                .createAt(this.getCreateAt())
                .updateAt(this.getUpdateAt())
                .build();
    }


}
