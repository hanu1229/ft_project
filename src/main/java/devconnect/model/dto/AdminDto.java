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

    private Integer adno;         // 관리자 번호 (PK)
    private String adid;          // 관리자 아이디
    private String adpwd;         // 비밀번호 (암호화 저장)
    private String adname;        // 관리자 이름
    private String adphone;       // 관리자 연락처
    private Integer adtype;       // 관리자 상태 코드 (0:신청, 1:승인, 2:반려, 3~9:기타)

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
                .adtype(this.adtype) // 상태코드 포함
                .build();
    } // fe

    // [2] Entity → Dto 변환 메서드 | rw 25-04-23 생성
    public static AdminDto toDto(AdminEntity entity) { // fs
        return AdminDto.builder()
                .adno(entity.getAdno())
                .adid(entity.getAdid())
                .adpwd(null) // 보안을 위해 패스워드 제외
                .adname(entity.getAdname())
                .adphone(entity.getAdphone())
                .adtype(entity.getAdtype())
                .createAt(entity.getCreateAt())
                .updateAt(entity.getUpdateAt())
                .build();
    } // fe

} // CE