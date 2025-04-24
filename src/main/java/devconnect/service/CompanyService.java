package devconnect.service;

import devconnect.model.dto.CompanyDto;
import devconnect.model.entity.CompanyEntity;
import devconnect.model.repository.CompanyRepository;
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@Transactional
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;

    // 1. post(회원가입)
    public boolean signup(CompanyDto companyDto){
        //1. 암호화
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String hashedPwd = passwordEncoder.encode(companyDto.getCpwd());
        companyDto.setCpwd(hashedPwd);

        CompanyEntity companyEntity = companyDto.toEntity();

        CompanyEntity saveEntity = companyRepository.save(companyEntity);

        if (saveEntity.getCno() >= 1){return true;}
        return false;
    }

    // JWT 객체
    private final JwtUtil jwtUtil;

    // 2. post(login)
    public  String login(CompanyDto companyDto){
    CompanyEntity companyEntity = companyRepository.findByCid(companyDto.getCid());
    if (companyEntity == null){return null;}

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    boolean inMath = passwordEncoder.matches(companyDto.getCpwd() , companyEntity.getCpwd() );

    if (inMath == false) return null;

    String token = jwtUtil.createToken(companyEntity.getCid(), "C");
    return token;
    }

    // 2. post(logout)
    public void logout(String token){
     String cid = jwtUtil.valnoateToken(token);
     jwtUtil.deleteToken(cid);
    }

    // 3. 내정보(개별정보) 조회
    public CompanyDto info(String token){
       String cid = jwtUtil.valnoateToken(token);
       if (cid == null) return null;
       CompanyEntity companyEntity = companyRepository.findByCid(cid);
       if (companyEntity == null)return  null;
       return companyEntity.toDto();
    }

    // 4. 기업정보 findAll
    public List<CompanyDto> findAll(){
        return  companyRepository.findAll().stream().map(CompanyEntity :: toDto).collect(Collectors.toList());
    }



//    //5. 기업 수정 update(상태) 012
//
//    public boolean stateCompany(String token , int cno , int state){
//
//        String loggedInCid = jwtUtil.valnoateToken(token);
//        if (loggedInCid == null) return false; // 토큰이 유효하지 않을경우
//
//        //2. 로그인한 기업 정보 조회 (권한 확인)
//        CompanyEntity loggedInCompany = companyRepository.findByCno(cno);
//        if (loggedInCompany == null) return false; // 요부분 오류시 수정
//
//        // 수정 기업 정보 조회
//        CompanyEntity companyEntity = companyRepository.findByCno(cno);
//        if (
//
//
//        if (state < 0 || state > 2) return  false;
//
//        //기업 상태 업데이트
//        companyRepository.set
//
//
//    }


}
