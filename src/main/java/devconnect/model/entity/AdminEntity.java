/* AdminEntity 클래스 | rw 25-04-19 생성

 관리자 DB 저장용 JPA Entity

 BaseTime 상속으로 createAt/updateAt 자동 관리

 DTO 변환 메서드 포함 (시간 정보 포함)
*/

package devconnect.model.entity;

import devconnect.model.dto.AdminDto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin")
@Data @NoArgsConstructor @AllArgsConstructor @Builder // lombok+ 어노테이션
public class AdminEntity extends BaseTime { // CS

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer adno;

    @Column(length = 30, nullable = false, unique = true)
    private String adid;

    @Column(length = 100, nullable = false)
    private String adpwd;

    @Column(length = 30, nullable = false)
    private String adname;

    @Column(length = 13)
    private String adphone;

    // [1] Entity → DTO 변환 메서드
    public AdminDto toDto() { // fs
        return AdminDto.builder()
                .adno(this.adno)
                .adid(this.adid)
                .adpwd(this.adpwd)
                .adname(this.adname)
                .adphone(this.adphone)
                .createAt(this.getCreateAt())
                .updateAt(this.getUpdateAt())
                .build();
    } // fe

} // CE