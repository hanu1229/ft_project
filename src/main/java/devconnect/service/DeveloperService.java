package devconnect.service;

import devconnect.model.dto.DeveloperDto;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.repository.DeveloperRepository;
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.concurrent.TimeUnit;

@Service
@Transactional
@RequiredArgsConstructor
public class DeveloperService {
    private final DeveloperRepository developerRepository;
    private final JwtUtil jwtUtil;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    // 1. 회원가입
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


    // 2. 로그인
    public String logIn( DeveloperDto developerDto ){
        DeveloperEntity developerEntity = developerRepository.findByDid( developerDto.getDid() );
        
        if( developerEntity == null ){ return null; }
        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        boolean isMatch = pwdEncoder.matches( developerDto.getDpwd(), developerEntity.getDpwd() );

        if( isMatch == false ) { return null; }
        String token = jwtUtil.createToken( developerEntity.getDid(), "Developer" );
        System.out.println("token = " + token);

        stringRedisTemplate.opsForValue().set(
                "RECENT_LOGIN : " + developerDto.getDid(), "true", 1, TimeUnit.DAYS );

        return token;
    } // f end

    // 3. 내 정보 조회
    public DeveloperDto info( String token ){
        String did = jwtUtil.valnoateToken( token );

        System.out.println( "did =" + did );
        if( did == null ){ return null; }
        System.out.println( "did =" + did );
        DeveloperEntity developerEntity = developerRepository.findByDid( did );
        if( developerEntity == null ){ return null; }
        return developerEntity.toDto();
    } // f end

    // 4. 로그아웃
    public void logout( String token ){
        String did = jwtUtil.valnoateToken( token );
        jwtUtil.deleteToken( did );
    } // f end

    // 5. 회원정보 수정
    public DeveloperDto onUpdate( String token,
                                  DeveloperDto developerDto ){
        String did = jwtUtil.valnoateToken( token );

        if( did == null ){ return null; }
        DeveloperEntity developerEntity = developerRepository.findByDid( did );

        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        boolean result = pwdEncoder.matches( developerDto.getDpwd(), developerEntity.getDpwd() );

        // 비밀번호 확인
        if( !result ){ return null; }

        developerEntity.setDphone( developerDto.getDphone() );
        developerEntity.setDaddress( developerDto.getDaddress() );
        developerEntity.setDemail( developerDto.getDemail() );

        return developerEntity.toDto();
    } // f end

    // 6. 개발자 정보 삭제
    public boolean onDelete( String token, DeveloperDto developerDto ){
        String did = jwtUtil.valnoateToken( token );

        if( did == null ){ return false; }
        DeveloperEntity developerEntity = developerRepository.findByDid( did );

        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        boolean result = pwdEncoder.matches( developerDto.getDpwd(), developerEntity.getDpwd() );

        if( result == false ){ return false; }

        return developerRepository.findById( developerEntity.getDno() )
                .map( ( entity ) -> {
                    developerRepository.deleteById( developerEntity.getDno() );
                    return true;
                })
                .orElse( false );
    } // f end


}
