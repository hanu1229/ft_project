package devconnect.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data @NoArgsConstructor @AllArgsConstructor
public class DeveloperDto {
    private int dno;
    private String did;
    private String dpwd;
    private String dname;
    private String dphone;
    private String dadress;
    private String demail;
    private String dprofile;


}
