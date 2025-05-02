package devconnect.util;

import devconnect.model.entity.AdminEntity;
import devconnect.model.entity.CompanyEntity;
import devconnect.model.entity.DeveloperEntity;
import devconnect.model.repository.AdminEntityRepository;
import devconnect.model.repository.CompanyRepository;
import devconnect.model.repository.DeveloperRepository;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

// ↓ Spring 컨테이너에 빈 등록
@Component
@RequiredArgsConstructor
public class JwtUtil {

    // 비밀키 알고리즘 : HS256알고리즘, HS512알고리즘
    // private String key = "인코딩된 HS512 비트키";
    // (1) 개발자가 임의로 지정한 키 : "qP9sLxV3tRzWn8vMbKjUyHdGcTfEeXcZwAoLpNjMqRsTuVyBxCmZkYhGjFlDnEpQzFgXt9pMwX8Sx7CtQ5VtBvKmA2QwE3D";
    // (2) 라이브러리를 이용한 임의 키 : import java.security.Key;
    // Keys.secretKeyFor(SignatureAlgorithm.암고리즘명);
    private Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Redis를 조작하기 위한 객체
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    private final CompanyRepository companyRepository;
    private final DeveloperRepository developerRepository;
    private final AdminEntityRepository adminEntityRepository;


    /// 01. JWT 토큰 발급 <br/>
    /// 사용자의 아이디를 받아서 토큰 만들기
    public String createToken(String id, String role) {
        // 권한부여
        Map<String, Object> claims = new HashMap<>();
        claims.put("id", id);
        claims.put("role", role);

        String token= Jwts.builder()
                // 토큰에 넣을 내용물 | 로그인 성공한 회원의 아이디 추가
                // 개발자 = D, 기업 = C, 관리자 = A
                .setClaims( claims )
                // 토큰이 발급된 날짜 | 현재 날짜 추가
                .setIssuedAt(new Date())
                // 토큰 만료 시간 | 밀리(1000/1)초 + new Date(System.currentTimeMillis()) : 현재 시간 밀리초
                // new Date(System.currentTimeMillis() + (1000 * 초 * 분 * 시))
                .setExpiration( new Date( System.currentTimeMillis() + ( 1000 * 60 * 60 * 24 ) ) )
                // 지정한 비밀키로 암호화
                .signWith(secretKey)
                // 위 정보로 JWT토큰을 생성하고 반환
                .compact();
        // 중복 로그인 방지를 하고자 웹서버가 아닌 Redis에 토큰 정보 저장(분산 처리, MSA 구축, AI 속도 등등)
        // Redis에 토큰 저장하기 | .opsForValue().set(key, value) --> .opsForValue().set(계정식별정보, 토큰)
        stringRedisTemplate.opsForValue().set("JWT:"+id, token, 24, TimeUnit.HOURS);
        // 현재 Redis에 저장된 key들을 확인 | .keys("") : 현재 Redis에 저장된 모든 key들을 반환
        System.out.println(stringRedisTemplate.keys(""));
        // 현재 Redis에 저장된 특정한 Key의 값 확인 .opsForValue().get(key);
        System.out.println(stringRedisTemplate.opsForValue().get("JWT:"+id));
        return token;
    }

    /// 02. JWT 토큰 검증
    public String valnoateToken(String token) {
        try {
            // parser() : 토큰을 검증하기 위한 함수
            Claims claims = Jwts.parser()
                    // 검증하기 위한 비밀키 추가
                    .setSigningKey(secretKey)
                    // 검증을 실행할 객체 생성
                    .build()
                    // 검증된 토큰 해석 | 실패시 예외 발생
                    .parseClaimsJws(token)
                    // 검증된 claims 객체 생성
                    .getBody();

            // 중복 로그인을 방지하고자 Redis에서 최근에 로그인된 토큰을 확인
            // 현재 전달받은 토큰에 저장된 회원정보(아이디)
            String id = (String)claims.get("id");
            String role = (String)claims.get("role");
            // 레디스에서 최신 토큰 가져오기
            String redisToken = stringRedisTemplate.opsForValue().get("JWT:"+id);
            // 현재 전달받은 토큰과 레디스에 저장된 토큰을 비교
            if( token.equals(redisToken) ) {
                // 3. Redis에 저장된 토큰도 파싱해서 role 확인
                Claims redisClaims = Jwts.parser()
                        .setSigningKey(secretKey)
                        .build()
                        .parseClaimsJws(redisToken)
                        .getBody();

                String redisRole = (String) redisClaims.get("role");

                // 4. 역할까지 일치할 때만 유효한 로그인 상태로 간주
                if (role.equals(redisRole)) {
                    return id;
                } else {
                    System.out.println(">> 권한 불일치");
                }
            }
        } catch(ExpiredJwtException e) {
            // 토큰이 만료 되었을 때 예외 클래스
            System.out.println(">> JWT 토큰 기간 만료 : " + e);
        } catch(JwtException e) {
            // 그외 모든 토큰 예외 클래스
            System.out.println(">> JWT 예외 : " + e);
        }
        // 유효하지 않은 토큰 또는 오류 발생 시 null 반환
        return null;
    }

    ///  로그아웃 시 Redis에 저장된 토큰 삭제
    public void deleteToken(String id) {
        stringRedisTemplate.delete("JWT:"+id);
    }

    /// 아이디에 따른 식별키 반환
    public String returnCode(String id) {
        CompanyEntity companyEntity = companyRepository.findByCid(id);
        if(companyEntity != null) { return "Company"; }
        DeveloperEntity developerEntity = developerRepository.findByDid(id);
        if(developerEntity != null) { return "Developer"; }
        AdminEntity adminEntity = adminEntityRepository.findByAdid(id).orElse(null);
        if(adminEntity != null) { return "Admin"; }
        return null;
    }


}