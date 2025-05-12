package devconnect.model.entity;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners( AuditingEntityListener.class )
@Getter
public class BaseTime {

    // 1. 생성날짜
    @CreatedDate // 엔티티의 생성 날짜/시간 주입
    private LocalDateTime createAt;

    // 2. 수정날짜
    @LastModifiedDate // 엔티티의 수정 날짜/시간 주입
    private LocalDateTime updateAt;
// =======================================================================================
    // 3 [수동 시간 수정용] updateAt 값 수동 설정 메서드 | admin 25-05-11
// =======================================================================================
/*
    - 목적: Spring JPA Auditing의 @LastModifiedDate는 자동 주입만 지원함.
            특정 상황에서 updateAt을 직접 설정하려면 수동 setter가 필요함.
    - 사용 위치: 서비스 또는 컨트롤러 레벨에서 수동 시간 지정 시 사용
    - 주의: Auditing 기능은 유지되며, 해당 메서드는 강제 시간 수정용 보조 수단임
*/
    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }

// =======================================================================================
    // 3 [수동 시간 수정용] updateAt 값 수동 설정 메서드 | adim 25-05-11
// =======================================================================================
/*
    - 목적: Spring JPA Auditing의 @LastModifiedDate는 자동 주입만 지원함.
            특정 상황에서 updateAt을 직접 설정하려면 수동 setter가 필요함.
    - 사용 위치: 서비스 또는 컨트롤러 레벨에서 수동 시간 지정 시 사용
    - 주의: Auditing 기능은 유지되며, 해당 메서드는 강제 시간 수정용 보조 수단임
*/
    public void setUpdateAt(LocalDateTime updateAt) {
        this.updateAt = updateAt;
    }
}
