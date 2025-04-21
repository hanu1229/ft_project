package devconnect.service;

import devconnect.model.dto.DeveloperDto;
import devconnect.model.repository.DeveloperRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@Transactional
@RequiredArgsConstructor
public class DeveloperService {
    private final DeveloperRepository developerRepository;

    public boolean signUp( DeveloperDto developerDto ){
        return true;
    } // f end

}
