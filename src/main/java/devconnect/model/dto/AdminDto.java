/*  AdminDto 클래스 | rw 25-04-27 리팩토링
    - 클라이언트 ⇔ 서버 간 관리자 정보 전달용 DTO입니다.
    - AdminEntity ⇉ AdminDto 간 변환 역할을 수행합니다.
    - createAt, updateAt 포함 (응답 시 시간 정보 포함용)
    - 유효성 검사(Validation) 어노테이션 추가
*/

package devconnect.model.dto;

// [*] 필요한 어노테이션 import
import devconnect.model.entity.AdminEntity;
import devconnect.model.entity.BaseTime;
import jakarta.validation.constraints.*; // [A] 유효성 검사 관련 어노테이션 import
import lombok.*; // [B] 롬복 어노테이션 import (Getter, Setter, Builder 등 자동 처리)

import java.time.LocalDateTime; // [C] 날짜 및 시간 관련 클래스 import

@Data // [D] Lombok 어노테이션 - Getter/Setter, toString 자동 생성
@NoArgsConstructor // [E] Lombok 어노테이션 - 기본 생성자 자동 생성
@AllArgsConstructor // [F] Lombok 어노테이션 - 전체 필드 초기화 생성자 자동 생성
@Builder // [G] Lombok 어노테이션 - 빌더 패턴 생성자 자동 생성
public class AdminDto extends BaseTime { // CS

    // =======================================================================================
    // [*] 필드 선언부

    private Integer adno; // [1] 관리자 번호 (Primary Key)

    @NotBlank(message = "아이디는 필수 입력 항목입니다.")
    private String adid; // [2] 관리자 아이디

    @NotBlank(message = "비밀번호는 필수 입력 항목입니다.")
    @Size(min = 8, max = 20, message = "비밀번호는 8자 이상 20자 이하로 입력해야 합니다.")
    private String adpwd; // [3] 비밀번호 (암호화 저장)

    @NotBlank(message = "이름은 필수 입력 항목입니다.")
    private String adname; // [4] 관리자 이름

    @NotBlank(message = "전화번호는 필수 입력 항목입니다.")
    private String adphone; // [5] 관리자 연락처

    @NotNull(message = "상태 코드는 필수 항목입니다.")
    private Integer adtype; // [6] 관리자 상태 코드 (0:신청, 1:승인, 2:반려, 3:퇴사 , 4~9:기타)

    private LocalDateTime createAt; // [7] 계정 생성일시
    private LocalDateTime updateAt; // [8] 계정 최종 수정일시

    // =======================================================================================
    // [1] Dto → Entity 변환 메서드
    public AdminEntity toEntity() { // fs
        return AdminEntity.builder()
                .adno(this.adno) // (1) 관리자 번호 매핑
                .adid(this.adid) // (2) 아이디 매핑
                .adpwd(this.adpwd) // (3) 비밀번호 매핑
                .adname(this.adname) // (4) 이름 매핑
                .adphone(this.adphone) // (5) 연락처 매핑
                .adtype(this.adtype) // (6) 상태 코드 매핑
                .build(); // (7) Entity 생성 완료
    } // fe

    // =======================================================================================
    // [2] Entity → Dto 변환 메서드
    public static AdminDto toDto(AdminEntity entity) { // fs
        return AdminDto.builder()
                .adno(entity.getAdno()) // (1) 관리자 번호
                .adid(entity.getAdid()) // (2) 관리자 아이디
                .adpwd(null) // (3) 비밀번호 제외 (보안 처리)
                .adname(entity.getAdname()) // (4) 관리자 이름
                .adphone(entity.getAdphone()) // (5) 관리자 연락처
                .adtype(entity.getAdtype()) // (6) 상태 코드
                .createAt(entity.getCreateAt()) // (7) 생성일시
                .updateAt(entity.getUpdateAt()) // (8) 수정일시
                .build();
    } // fe

} // CE
