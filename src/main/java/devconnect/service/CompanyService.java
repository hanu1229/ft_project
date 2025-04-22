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
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

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

    String token = jwtUtil.createToken(companyEntity.getCid());
    return token;
    }

    // 2. post(logout)
    public void logout(String token){
     String cid = jwtUtil.valnoateToken(token);
     jwtUtil.deleteToken(cid);
    }



}
