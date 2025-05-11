package devconnect.service;

import devconnect.model.dto.CompanyDto;
import devconnect.model.dto.developer.DeveloperDto;
import devconnect.model.entity.CompanyEntity;
import devconnect.model.repository.CompanyRepository;
import devconnect.util.FileUtil;
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    @Autowired
    private FileUtil fileUtil;


    // 파일을 저장할 실제 서버 경로를 설정
    // 이 경로는 프로젝트 빌드 경로(war/jar) 외부에 있어야 애플리케이션 업데이트 시 파일이 보존
    // 1. post(회원가입)
    public boolean signup(CompanyDto companyDto){
        // 1. 파일 처리 로직
        String saveFileName = null;

        MultipartFile cprofileFile = companyDto.getFile();// dto에서 MultipartFile 가져옴

         if (cprofileFile != null && !cprofileFile.isEmpty()){
             //FileUtile의 fileUpload 메서드를 사용하여 파일 저장
             saveFileName = fileUtil.fileUpload(cprofileFile);

             // FileUtil.FileUpload 실패 시 (null 반환)오류 처리
             if (saveFileName == null){
                 System.err.println("FileUtile을 통한 파일 업로드 실패");
                 throw new RuntimeException("프로필 이미지 파일 업로드 실패");
                 // 파일 저장 실패해도 회원가입은 진행하려면 savedFileName은 null 상태로 계속 진행합니다.

             }
             System.out.println("FileTrile을 통한 파일 저장 성공 :" + saveFileName);
         }

        //2. 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPwd = passwordEncoder.encode(companyDto.getCpwd());
        companyDto.setCpwd(hashedPwd);

        // CompanyEntity companyEntity = companyDto.toEntity();
        CompanyEntity companyEntity = companyDto.toEntity();
        companyEntity.setCprofile(saveFileName);






        // CompanyEntity saveEntity = companyRepository.save(companyEntity);

       //4. Entity를 Repository를 통해 데이터베이스에 저장
        CompanyEntity saveEntity = companyRepository.save(companyEntity);


        // if (saveEntity.getCno() >= 1){return true;}
        return true;
    }

    // JWT 객체
    private final JwtUtil jwtUtil;

    // 2. post(login)
    public  String login(CompanyDto companyDto){
    CompanyEntity companyEntity = companyRepository.findByCid(companyDto.getCid());
    if (companyEntity == null){return null;}
    if (companyEntity.getState() == 1){return null;}


    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    boolean inMath = passwordEncoder.matches(companyDto.getCpwd() , companyEntity.getCpwd() );

    if (inMath == false) {return null;}

//    createToken( 아이디, 권한( Developer, Company, Admin ) )
    String token = jwtUtil.createToken(companyEntity.getCid(), "Company");
    return token;

    }

    // 3. post(logout)
    public void logout(String token){
     String cid = jwtUtil.valnoateToken(token);
     jwtUtil.deleteToken(cid);
    }

    // 4. 내정보(개별정보) 조회
    public CompanyDto info(String token){
       String cid = jwtUtil.valnoateToken(token);
       if (cid == null) return null;
       CompanyEntity companyEntity = companyRepository.findByCid(cid);
       if (companyEntity == null)return  null;
       return companyEntity.toDto();
    }

    // 5. 기업정보 findAll
    public List<CompanyDto> findAll(){
        return  companyRepository.findAll().stream().map(CompanyEntity :: toDto).collect(Collectors.toList());
    }



    //6. 기업 수정 update(상태) 012

    public boolean stateCompany(String token , CompanyDto companyDto){

        String loggedInCid = jwtUtil.valnoateToken(token);
        if (loggedInCid == null) return false; // 토큰이 유효하지 않을경우

        // 로그인한 기업 정보 조회 (권한 확인)
        CompanyEntity loggedInCompany = companyRepository.findByCid(loggedInCid);
        if (loggedInCompany == null) return false; // 요부분 오류시 수정

        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        boolean result = pwdEncoder.matches(companyDto.getCpwd() , loggedInCompany.getCpwd());
        System.out.println("기업수정비밀번호 :" +  result);

        if (!result) return false;


        // 수정 기업 정보 조회
        Optional<CompanyEntity> companyEntityOptional = companyRepository.findById(loggedInCompany.getCno());
        if (companyEntityOptional.isEmpty()) return false;

        CompanyEntity companyEntity = companyEntityOptional.get();



        if (companyEntity != null) { companyEntity.setState(1);} // 기업상태 변경

        return true;
    }

    public boolean onUpdate(CompanyDto companyDto, int loginCno){
        // 1. 로그인된 회사 ID 유효성 검사
        if (loginCno <= 0){
            return false;
        }

        // 2. 데이터베이스에서 회사 엔티티 조회
        Optional<CompanyEntity> companyEntityOptional = companyRepository.findById(loginCno);
        if (companyEntityOptional.isEmpty()){
            return false; // 회사 정보 없음
        }
        CompanyEntity companyEntity = companyEntityOptional.get();

        // 3. 비밀번호 확인 (현재 비밀번호가 맞는지 검증)
        // companyDto.getCpwd()는 사용자가 입력한 '현재 비밀번호'여야 합니다.
        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        boolean passwordMatches = pwdEncoder.matches(companyDto.getCpwd() , companyEntity.getCpwd());

        if (!passwordMatches){
            // 비밀번호 불일치 시 업데이트 거부
            return false;
        }

        // 4. 텍스트 기반 필드 업데이트
        companyEntity.setCname(companyDto.getCname());
        companyEntity.setCphone(companyDto.getCphone());
        companyEntity.setCemail(companyDto.getCemail());
        companyEntity.setCadress(companyDto.getCadress());

        // 5. 프로필 이미지 파일 처리 로직 개선
        String oldProfileFileName = companyEntity.getCprofile(); // 현재 엔티티에 저장된 기존 파일 이름
        MultipartFile newProfileFile = companyDto.getFile();    // CompanyDto를 통해 넘어온 새로운 파일

        // 새 프로필 파일이 존재하고 (null이 아니고) 비어있지 않다면 (사용자가 새 파일을 업로드했다면)
        if (newProfileFile != null && !newProfileFile.isEmpty()){
            // 5-1. 새 파일 업로드 시도
            String newSavedFileName = fileUtil.fileUpload(newProfileFile);
            if (newSavedFileName == null){
                // 파일 업로드 실패 시 런타임 예외 발생 (또는 다른 오류 처리)
                throw  new RuntimeException("파일 업로드 오류: 새 프로필 이미지 저장 실패");
            }

            // 5-2. 엔티티의 프로필 파일 이름을 새로 업로드된 파일 이름으로 설정
            companyEntity.setCprofile(newSavedFileName);

            // 5-3. 기존 프로필 파일이 있고, 새로운 파일로 교체된 경우에만 기존 파일 삭제
            //      (oldProfileFileName이 null이 아니거나 비어있지 않다면)
            if (oldProfileFileName != null && !oldProfileFileName.isEmpty()){
                fileUtil.fileDelete(oldProfileFileName);
            }
        }
        // else (새 파일이 없거나 비어있다면):
        //   companyEntity.getCprofile()는 기존 값을 그대로 유지합니다.
        //   따라서 기존 파일을 삭제할 필요가 없습니다.

        // 6. 변경된 엔티티를 데이터베이스에 저장 (JPA/Hibernate는 트랜잭션 범위 내에서 자동 저장될 수도 있지만, 명시적 호출)
        // CompanyRepository가 JpaRepository를 상속받았다면 save 메서드를 통해 변경사항이 반영됩니다.
        companyRepository.save(companyEntity);

        return true; // 업데이트 성공
    }

//    //8 기업 정보 삭제
//    public boolean deleteProduct(String token , CompanyDto companyDto){
//        System.out.println("CompanyController.deleteProduct");
//        System.out.println("logincno = " + token + ", dto = " + companyDto);
//
//       String cid = jwtUtil.valnoateToken(token);
//
//       if ( cid == null) return false;
//       CompanyEntity companyEntity = companyRepository.findByCid(cid);
//
//       BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
//       boolean result = pwdEncoder.matches(companyDto.getCpwd() , companyEntity.getCpwd());
//       //비밀번호 확인
//        if (!result ) return false;
//
//        return  companyRepository.findById(companyEntity.getCno()).map((entity) -> {
//            companyRepository.deleteById(companyEntity.getCno());
//            return true;
//        }).orElse(false);
//
//    }

    //9 기업 비밀번호 변경 오류시 확인할 부분 주석처리
    public  Boolean pwupdate(String token , CompanyDto companyDto){
        System.out.println("token = " + token + ", companyDto = " + companyDto);
        System.out.println("CompanyController.pwupdate");

        String cid = jwtUtil.valnoateToken(token);

        if (cid == null) return false;
        CompanyEntity companyEntity = companyRepository.findByCid(cid);

        BCryptPasswordEncoder pwdEncoder = new BCryptPasswordEncoder();
        boolean oldPasswordMatches = pwdEncoder.matches(companyDto.getCpwd() , companyEntity.getCpwd());
        //System.out.println(oldPasswordMatches);
        //비밀번호 확인
        if (!oldPasswordMatches) {
        //System.out.println("Password verification failed for " + cid);
        return false;}

        // 사용자가 입력한 비밀번호 비어있는지 확인
        if (companyDto.getUpcpwd() == null || companyDto.getUpcpwd().isEmpty()){
            //System.out.println("New password is empty for " + cid);
            return false;
        }

        System.out.println(companyDto.getUpcpwd());

        String newHashedPassword = pwdEncoder.encode(companyDto.getUpcpwd()); //새 비밀번호 암호화
        companyEntity.setCpwd(newHashedPassword);
        return true; //성공시 true 반환
    }

    public CompanyDto findByCno(int cno) {
        CompanyEntity company = companyRepository.findById(cno).orElseThrow(() -> new RuntimeException("Company not found"));
        return company.toDto();
    }

}
