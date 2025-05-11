package devconnect.service;

import devconnect.model.dto.CompanyDto;
import devconnect.model.dto.developer.DeveloperDeleteDto;
import devconnect.model.dto.developer.DeveloperDto;
import devconnect.model.dto.developer.DeveloperPwdUpdateDto;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.repository.DeveloperRepository;
import devconnect.util.ApiResponse;
import devconnect.util.FileUtil;
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
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
    public ApiResponse<String> logIn( DeveloperDto developerDto ){
        DeveloperEntity developerEntity = developerRepository.findByDid( developerDto.getDid() );

                                        // 탈퇴회원은 표시 x
        if( developerEntity == null || !developerEntity.isDstate() ){ return new ApiResponse<>( false, "존재하지 않는 ID입니다.", null ); }
        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        boolean isMatch = pwdEncoder.matches( developerDto.getDpwd(), developerEntity.getDpwd() );

        if( isMatch == false ) { return new ApiResponse<>( false, "비밀번호가 일치하지 않습니다.", null ); }
        String token = jwtUtil.createToken( developerEntity.getDid(), "Developer" );
        System.out.println("token = " + token);

        stringRedisTemplate.opsForValue().set(
                "RECENT_LOGIN : " + developerDto.getDid(), "true", 1, TimeUnit.DAYS );

        return new ApiResponse<>( true, "로그인 성공", token );
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

        if( preFile == "default.jpg"){ return true; }
        if( newFile != null && !newFile.isEmpty() ){
            String saveFileName = fileUtil.fileUpload( developerDto.getDfile() );
            if( saveFileName == null ){ throw new RuntimeException("파일 업로드 오류 발생"); }
            developerEntity.setDprofile( saveFileName );
        }

        // 바뀐 이미지 삭제
        fileUtil.fileDelete( preFile );

        return true;
    } // f end

    // 5-1. 개발자 비밀번호 수정
    public ApiResponse<Boolean> onUpdatePwd(DeveloperPwdUpdateDto developerPwdUpdateDto, int logInDno ){
        Optional< DeveloperEntity > optionalDeveloperEntity = developerRepository.findById( logInDno );
        // 유효성 검사
        if( optionalDeveloperEntity.isEmpty() ){
            return new ApiResponse<>( false, "사용자 없음", null ); }
        if ( developerPwdUpdateDto.getNewPwd().length() < 8) {
            return new ApiResponse<>( false, "비밀번호는 8자 이상이어야 합니다.", null); }

        DeveloperEntity developerEntity = optionalDeveloperEntity.get();
        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();

        boolean result = pwdEncoder.matches( developerPwdUpdateDto.getMatchPwd(), developerEntity.getDpwd() );
        // 현재 비밀번호 일치 유효성 검사
        if( !result ){
            return new ApiResponse<>( false, "현재 비밀번호가 일치하지 않습니다.", null ); }

        String newHashPwd = pwdEncoder.encode(developerPwdUpdateDto.getNewPwd() );
        developerEntity.setDpwd( newHashPwd );

        return new ApiResponse<>( true, "비밀번호 변경이 완료되었습니다.", true );
    } // f end

    // 6. 개발자 정보 삭제
    public boolean onDelete( String token, String dpwd ){
        String did = jwtUtil.valnoateToken( token );

        if( did == null ){ return false; }
        DeveloperEntity developerEntity = developerRepository.findByDid( did );

        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        boolean result = pwdEncoder.matches( dpwd, developerEntity.getDpwd() );

        if( result == false ){ return false; }
        developerEntity.setDstate( false );

        return true;
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

    // 8. 개발자 순위 조회
    public Page<DeveloperDto> ranking(int page, int size, String keyword ){
        Pageable pageable = PageRequest.of( page-1, size, Sort.by( Sort.Direction.DESC, "dno" ));

        Page<DeveloperEntity> developerEntities = developerRepository.findBySearch( pageable );
        Page<DeveloperDto> developerList = developerEntities.map( DeveloperEntity::toDto );
        return developerList;
    } // f end

    // dno를 DeveloperDto로 변환
    public List<DeveloperDto> findByDnoList(List<Integer> dnoList) {
        List<Object[]> resultList = developerRepository.findDnoAndDnameByDnoList(dnoList);
        List<DeveloperDto> dtoList = new ArrayList<>();
        for (Object[] obj : resultList) {
            int dno = (int) obj[0];
            String dname = (String) obj[1];
            DeveloperDto dto = new DeveloperDto();
            dto.setDno(dno);
            dto.setDname(dname);
            dtoList.add(dto);
        }
        return dtoList;
    } // f end

}
