/*  AdminEntity 클래스 | rw 25-04-19 생성
    - 관리자 DB 저장용 JPA Entity입니다.
    - 'admin' 테이블과 매핑됩니다.
    - BaseTime 상속으로 생성일/수정일을 자동 관리합니다.

    연동 테이블:
    - admin_status_code (관리자 상태코드 참조용)

    주요 필드:
    - adno: 관리자 고유번호 (PK)
    - adid: 관리자 ID
    - adpwd: 암호화된 비밀번호
    - adtype: 관리자 상태코드 (0:신청 ~ 9:기타)

    추가 기능:
    - DTO 변환 메서드 포함 (시간 정보 함께 변환)
*/

package devconnect.model.entity;

import devconnect.model.dto.AdminDto;
import jakarta.persistence.*; // [A] JPA 관련 어노테이션 import (Entity, Id, Table 등)
import lombok.*; // [B] Lombok 어노테이션 import (Getter, Setter, Builder 등)

@Entity // [C] 이 클래스가 JPA 엔티티임을 명시
@Table(name = "admin") // [D] 이 엔티티가 'admin' 테이블과 매핑됨을 지정
@Data // [E] Lombok - Getter, Setter, ToString 등 자동 생성
@NoArgsConstructor // [F] Lombok - 기본 생성자 자동 생성
@AllArgsConstructor // [G] Lombok - 전체 필드 초기화 생성자 자동 생성
@Builder // [H] Lombok - 빌더 패턴 생성자 자동 생성
public class AdminEntity extends BaseTime { // CS

    // =======================================================================================
    // [*] 필드 선언부

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer adno; // [1] 관리자 고유 번호 (Primary Key, Auto Increment)

    @Column(length = 30, nullable = false, unique = true)
    private String adid; // [2] 관리자 로그인 ID (고유 제약조건)

    @Column(length = 100, nullable = false)
    private String adpwd; // [3] 관리자 비밀번호 (bcrypt 암호화 저장)

    @Column(length = 30, nullable = false)
    private String adname; // [4] 관리자 이름

    @Column(length = 13)
    private String adphone; // [5] 관리자 연락처

    @Column(columnDefinition = "INT DEFAULT 0 COMMENT '관리자 상태 코드 (0~9)'")
    private Integer adtype; // [6] 관리자 상태 코드 (0: 신청, 1: 승인, 2: 반려 등)

    // =======================================================================================
    // [1] Entity → DTO 변환 메서드
    public AdminDto toDto() { // fs
        return AdminDto.builder()
                .adno(this.adno)               // (1) 관리자 번호
                .adid(this.adid)                // (2) 관리자 ID
                .adpwd(null)                    // (3) 비밀번호 제외 (보안)
                .adname(this.adname)             // (4) 관리자 이름
                .adphone(this.adphone)           // (5) 관리자 연락처
                .adtype(this.adtype)             // (6) 관리자 상태 코드
                .createAt(this.getCreateAt())    // (7) 생성일시
                .updateAt(this.getUpdateAt())    // (8) 수정일시
                .build();
    } // fe

} // CE