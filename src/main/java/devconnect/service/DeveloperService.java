package devconnect.service;

import devconnect.model.dto.DeveloperDto;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.repository.DeveloperRepository;
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@Transactional
@RequiredArgsConstructor
public class DeveloperService {
    private final DeveloperRepository developerRepository;

    public boolean signUp( DeveloperDto developerDto ){
        if( developerDto.getDpwd() == null ){ return false; }
        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        String hashPwd = pwdEncoder.encode( developerDto.getDpwd() );
        developerDto.setDpwd( hashPwd );

        DeveloperEntity developerEntity = developerDto.toEntity();
        DeveloperEntity saveEntity = developerRepository.save( developerEntity );

        if( saveEntity.getDno() >= 1 ){ return true; }

        return false;
    } // f end

    private final JwtUtil jwtUtil;

    public String logIn( DeveloperDto developerDto ){
        DeveloperEntity developerEntity = developerRepository.findByDid( developerDto.getDid() );

        if( developerEntity != null ){ return null; }
        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        boolean inMatch = pwdEncoder.matches( developerDto.getDpwd(), developerEntity.getDpwd() );
        if( inMatch == false ) { return null; }
        String token = jwtUtil.createToken( developerEntity.getDid() );
        System.out.println("token = " + token);

        return "1";
    } // f end



}
