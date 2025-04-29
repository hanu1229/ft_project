package devconnect.model.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AdminLoginDto {

    @NotBlank(message = "아이디는 필수입니다.")
    private String adid;

    @NotBlank(message = "비밀번호는 필수입니다.")
    private String adpwd;
}
