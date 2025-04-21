package devconnect.model.dto;

import devconnect.model.entity.DeveloperEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private String dprofile;
    private int dlevel;
    private int dcurrentExp;
    private int dtotalExp;
    private LocalDateTime createAt;
    private LocalDateTime updateAt;

    public DeveloperEntity toEntity(){
        return DeveloperEntity.builder()
                .dno( this.dno )
                .did( this.did )
                .dphone( this.dphone )
                .daddress( this.daddress )
                .demail( this.demail )
                .dprofile( this.dprofile )
                .dlevel( this.dlevel )
                .dcurrentExp( this.dcurrentExp )
                .dtotalExp( this.dtotalExp )
                .build();
    } // f end

}
