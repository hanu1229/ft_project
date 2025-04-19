/*
 * AdminDto 클래스 | rw 25-04-19 생성
 * - 클라이언트 ⇄ 서버 간 관리자 정보 전달용 DTO
 * - AdminEntity ↔ AdminDto 간 변환 역할 수행
 * - createAt, updateAt 포함 (응답 시 시간 정보 포함용)
*/

package devconnect.model.dto;

import devconnect.model.entity.AdminEntity;
import lombok.*;

import java.time.LocalDateTime;

@Data @NoArgsConstructor @AllArgsConstructor @Builder // lombok+ 어노테이션
public class AdminDto { // CS

    private Integer adno;
    private String adid;
    private String adpwd;
    private String adname;
    private String adphone;

    private LocalDateTime createAt;  // [*] 관리자 계정 생성일시
    private LocalDateTime updateAt;  // [*] 관리자 정보 최종 수정일시

    // [1] Dto → Entity 변환 메서드
    public AdminEntity toEntity() { // fs
        return AdminEntity.builder()
                .adno(this.adno)
                .adid(this.adid)
                .adpwd(this.adpwd)
                .adname(this.adname)
                .adphone(this.adphone)
                .build();
    } // fe

} // CE