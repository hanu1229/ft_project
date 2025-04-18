package devconnect.model.entity;

import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AutoCloseable.class)
@Getter
public class BaseTime {

    // 1. 생성날짜
    @CreatedDate // 엔티티의 생성 날짜/시간 주입
    private LocalDateTime createAt;

    // 2. 수정날짜
    @LastModifiedDate // 엔티티의 수정 날짜/시간 주입
    private LocalDateTime updateAt;

}
