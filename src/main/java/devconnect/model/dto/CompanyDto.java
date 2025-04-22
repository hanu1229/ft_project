package devconnect.model.dto;

import devconnect.model.entity.CompanyEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data@Builder
@NoArgsConstructor@AllArgsConstructor
public class CompanyDto {

    private int cno;
    private String cid;
    private String cpwd;
    private String cname; // 기업명
    private String cphone;
    private String cadress; // 주소
    private String cemail;
    private String cbusiness; // 사업자 번호
    private String cprofile; // jpg파일
    private int state;

    public CompanyEntity toEntity(){
        return CompanyEntity.builder()
                .cno(cno)
                .cid(cid)
                .cpwd(cpwd)
                .cname(cname)
                .cphone(cphone)
                .cadress(cadress)
                .cemail(cemail)
                .cbusiness(cbusiness)
                .cprofile(cprofile)
                .state(state)
                .build();
    }



}
