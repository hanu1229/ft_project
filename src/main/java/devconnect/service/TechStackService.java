package devconnect.service;

import devconnect.model.dto.TechStack.TechStackDto;
import devconnect.model.entity.TechStackEntity;
import devconnect.model.repository.TechStackRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class TechStackService {
    private final TechStackRepository techStackRepository;

    // 1. 기술스택 등록
//    public Boolean onWrite( TechStackDto techStackDto ){
//
//    } // f end

    // 2. 기술스택 조회
    public List<TechStackDto> findAll(){
        List<TechStackEntity> techStackEntityList = techStackRepository.findAll();
        return techStackEntityList.stream()
                .map( TechStackEntity::toDto )
                .toList();
    } // f end

    // 3. 기술스택 수정

    // 4. 기술스택 삭제
}
