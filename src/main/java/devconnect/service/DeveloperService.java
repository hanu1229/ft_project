package devconnect.service;

import devconnect.model.dto.DeveloperDto;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.repository.DeveloperRepository;
import devconnect.util.FileUtil;
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
import org.springframework.web.multipart.MultipartFile;

import javax.swing.text.html.Option;
import java.io.File;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class DeveloperService {
    private final DeveloperRepository developerRepository;
    private final JwtUtil jwtUtil;
    private final FileUtil fileUtil;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    // 1. 회원가입
    public boolean signUp( DeveloperDto developerDto ){
        // 비밀번호 암호화
        if( developerDto.getDpwd() == null ){ return false; }
        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        String hashPwd = pwdEncoder.encode( developerDto.getDpwd() );
        developerDto.setDpwd( hashPwd );

        // 파일처리
        String saveFileName = null;
        if( developerDto.getDfile() != null && !developerDto.getDfile().isEmpty() ){
          saveFileName = fileUtil.fileUpload( developerDto.getDfile() );
          if( saveFileName == null ){ throw new RuntimeException("업로드 중 오류 발생"); }
        } // if end

        DeveloperEntity developerEntity = developerDto.toEntity();
        if( saveFileName != null ){ developerEntity.setDprofile( saveFileName ); }

        DeveloperEntity saveEntity = developerRepository.save( developerEntity );

        // 파일 업로드 취소
        if( saveEntity.getDno() <= 0 ){
            if( saveFileName != null ){ fileUtil.fileDelete( saveFileName ); }
            throw new RuntimeException("회원 가입 실패");
        }

        return true;
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
    public boolean onUpdate( DeveloperDto developerDto, int logInDno ){
        if( logInDno <= 0 ){ return false; }
        Optional< DeveloperEntity > optionalDeveloperEntity = developerRepository.findById( logInDno );
        if( optionalDeveloperEntity.isEmpty() ){ return false; }
        DeveloperEntity developerEntity = optionalDeveloperEntity.get();

        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        boolean result = pwdEncoder.matches( developerDto.getDpwd(), developerEntity.getDpwd() );

        // 비밀번호 확인
        if( !result ){ return false; }

        developerEntity.setDphone( developerDto.getDphone() );
        developerEntity.setDaddress( developerDto.getDaddress() );
        developerEntity.setDemail( developerDto.getDemail() );

        MultipartFile newFile = developerDto.getDfile();
        String preFile = developerEntity.getDprofile();
        if( newFile != null && !newFile.isEmpty() ){
            String saveFileName = fileUtil.fileUpload( developerDto.getDfile() );
            if( saveFileName == null ){ throw new RuntimeException("파일 업로드 오류 발생"); }
            developerEntity.setDprofile( saveFileName );
        }

        // 바뀐 이미지 삭제
        fileUtil.fileDelete( preFile );

        return true;
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

    // 7. 개발자 전체 조회
    public List<DeveloperDto> findAll( String token ){
        if( token != null ){
            List<DeveloperEntity> developerListAll = developerRepository.findAll();
            return developerListAll.stream()
                    .map(DeveloperEntity::toDto)
                    .collect(Collectors.toList());
        } // if end
        return null;
    } // f end

}
