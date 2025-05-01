package devconnect.model.dto;

import devconnect.model.entity.CompanyEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;


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
    private LocalDateTime createAt;
    private LocalDateTime updateAt;


    private MultipartFile cprofile; // jpg파일
    private int state;


        //Entity 전달때문에 service에서 build 만듬
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
                .state(state)
                .build();
    }



}
