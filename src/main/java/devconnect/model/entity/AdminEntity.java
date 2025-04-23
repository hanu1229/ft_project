/* AdminEntity 클래스 | rw 25-04-19 생성

 관리자 DB 저장용 JPA Entity
 - admin 테이블과 매핑됨
 - BaseTime 상속 → 생성일/수정일 자동 관리

 연동 테이블:
 - admin_status_code (상태코드 참조용)

 주요 필드:
 - adno: 관리자 고유번호 (PK)
 - adid: 관리자 ID
 - adpwd: 암호화된 비밀번호
 - adtype: 관리자 상태코드 (0:신청 ~ 9:기타 등)

 DTO 변환 메서드 포함 (시간 정보 포함)
*/

package devconnect.model.entity;

import devconnect.model.dto.AdminDto;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "admin")
@Data @NoArgsConstructor @AllArgsConstructor @Builder // 롬복 어노테이션으로 생성자/빌더 자동 생성
public class AdminEntity extends BaseTime { // CS

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer adno; // 관리자 고유 번호

    @Column(length = 30, nullable = false, unique = true)
    private String adid; // 관리자 로그인 ID

    @Column(length = 100, nullable = false)
    private String adpwd; // 관리자 비밀번호 (bcrypt 암호화 저장)

    @Column(length = 30, nullable = false)
    private String adname; // 관리자 이름

    @Column(length = 13)
    private String adphone; // 관리자 연락처

    @Column(columnDefinition = "INT DEFAULT 0 COMMENT '관리자 상태 코드 (0~9)'")
    private Integer adtype; // 관리자 상태 코드 (0:신청, 1:승인, 2:반려, 3~9:기타)

    // [1] Entity → DTO 변환 메서드
    public AdminDto toDto() { // fs
        return AdminDto.builder()
                .adno(this.adno)
                .adid(this.adid)
                .adpwd(null)
                .adname(this.adname)
                .adphone(this.adphone)
                .adtype(this.adtype) // 상태코드 추가
                .createAt(this.getCreateAt())
                .updateAt(this.getUpdateAt())
                .build();
    } // fe

} // CE