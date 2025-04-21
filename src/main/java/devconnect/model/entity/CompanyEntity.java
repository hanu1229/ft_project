package devconnect.model.entity;

import devconnect.model.dto.CompanyDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
                .cprofile(cprofile)
                .build();
    }


}
