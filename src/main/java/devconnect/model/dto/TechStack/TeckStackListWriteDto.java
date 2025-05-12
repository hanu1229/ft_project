package devconnect.model.dto.TechStack;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@Data @NoArgsConstructor @AllArgsConstructor
public class TeckStackListWriteDto {
    private List<Integer> techStackList;
    private Integer tslno;
}
