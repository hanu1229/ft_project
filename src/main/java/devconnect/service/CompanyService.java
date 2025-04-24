package devconnect.service;

import devconnect.model.dto.CompanyDto;
import devconnect.model.entity.CompanyEntity;
import devconnect.model.repository.CompanyRepository;
import devconnect.util.JwtUtil;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;
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

//    createToken( 아이디, 권한( Developer, Company, Admin ) )
    String token = jwtUtil.createToken(companyEntity.getCid(), "Company");
    return token;
    }

    // 2. post(logout)
    public void logout(String token){
     String cid = jwtUtil.valnoateToken(token);
     jwtUtil.deleteToken(cid);
    }

    // 3. 기업정보 findAll
    public List<CompanyDto> findAll(){
        return  companyRepository.findAll().stream().map(CompanyEntity :: toDto).collect(Collectors.toList());
    }


}
