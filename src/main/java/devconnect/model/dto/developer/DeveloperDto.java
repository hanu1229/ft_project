package devconnect.model.dto.developer;

import devconnect.model.entity.DeveloperEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;

@Builder
@Data @NoArgsConstructor @AllArgsConstructor
public class DeveloperDto {
    private int dno;
    private String did;
    private String dpwd;
    private String dname;
    private String dphone;
    private String daddress;
    private String demail;
    private String dprofile; // 파일명
    private int dlevel;
    private int dcurrentExp;
    private int dtotalExp;
    private boolean dstate;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;
    private MultipartFile dfile; // .jpg / png /

    public DeveloperEntity toEntity(){
        return DeveloperEntity.builder()
                .dno( this.dno )
                .did( this.did )
                .dpwd( this.dpwd )
                .dname( this.dname )
                .dphone( this.dphone )
                .daddress( this.daddress )
                .demail( this.demail )
                .dprofile( this.dprofile )
                .dlevel( this.dlevel )
                .dcurrentExp( this.dcurrentExp )
                .dtotalExp( this.dtotalExp )
                .dstate( this.dstate )
                .build();
    } // f end

}
