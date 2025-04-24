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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

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
    CompanyEntity companyEntity = companyRepository.findByCid(companyDto.getCid()); // 전달받은 매개변수의 id 를 받아와 가져옴
    if (companyEntity == null){return null;} // 비어있는지 확인

    BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(); // 암호화 인스턴스
    boolean inMath = passwordEncoder.matches(companyDto.getCpwd() , companyEntity.getCpwd() ); // 비밀번호 비교

    if (inMath == false) return null; // 매칭이 되지 않을경우 null 반환

    String token = jwtUtil.createToken(companyEntity.getCid()); // 토큰 생성후 return
    return token;
    }

    // 2. post(logout)
    public void logout(String token){
     String cid = jwtUtil.valnoateToken(token);
     jwtUtil.deleteToken(cid); // 토큰 확인후 삭제
    }

    // 3. 기업정보 findAll
    public List<CompanyDto> findAll(){
        return  companyRepository.findAll().stream().map(CompanyEntity :: toDto).collect(Collectors.toList());
    }

    // 4. 기업 개별정보
    public CompanyDto viewCompany(int cno ){

        Optional<CompanyEntity> companyEntityOptional = companyRepository.findById(cno);


        if (companyEntityOptional.isEmpty())return null;
        CompanyEntity companyEntity = companyEntityOptional.get();

        return companyEntity.toDto();

    }

    //5. 기업 수정 update(상태) 012

    public boolean stateCompany(String token , int cno , int state){

        String loggedInCid = jwtUtil.valnoateToken(token);
        if (loggedInCid == null) return false; // 토큰이 유효하지 않을경우

        //2. 로그인한 기업 정보 조회 (권한 확인)
        CompanyEntity loggedInCompany = companyRepository.findByCid(loggedInCid);
        if (loggedInCompany == null) return false; // 요부분 오류시 수정

        // 수정 기업 정보 조회
        Optional<CompanyEntity> companyEntityOptional = companyRepository.findById(cno);
        if (companyEntityOptional.isEmpty()) return false;


    }



}
