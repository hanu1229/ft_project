package devconnect.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Component // Spring에서 컨테이너에 bean 등록
public class JwtUtil { // CS

    // - 비밀키의 알고리즘 : HS256알고리즘 , HS512알고리즘
    // private String secreKey = "인코딩된 HS512 비트 키";
    // (1) 개발자 임의로 지정한 키 : private String secretKey = "2C68318E352971113645CBC72861E1EC23F48D5BAA5F9B405FED9DDDCA893EB4";
    // (2) 라이브러리 이용한 임의(랜덤) 키 :
    // import java.security.Key;
    // Keys.secretKeyFor( SignatureAlgorithm.알고리즘명);
    private Key secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    @Autowired // 빈 주입
    private StringRedisTemplate stringRedisTemplate; //[1-3]에 있는 Redis를 조작하기 위한 객체

    // [1-1] JWT 토큰 발급
    public String createToken(String memail) {
        // - 사용자의 이메일을 받아서 토큰 만들기
        // return Jwts.builder() [1-3]을 쓰기 위해 주석처리
        String token = Jwts.builder()
                // - 토큰에 넣을 내용물(content)
                .setSubject(memail)
                // - 토큰이 발급된 날짜 , new Date() : 자바에서 제공하는 현재날짜 클래스
                .setIssuedAt(new Date())
                // - 토큰 만료 시간 ,
                // - new Date(System.currentTimeMillis()+(1000*초*분*시)) // - 밀리초 단위
                .setExpiration(new Date(System.currentTimeMillis() + (1000 * 60 * 60 * 24)))
                // - 지정한 비밀키로 암호화 한다.
                .signWith(secretKey)
                // 위 정보로 JWT 토큰을 생성하고 반환한다.
                .compact();

        // [1-2] 중복 로그인을 방지하고자 웹서버가 아닌 Redis 에 토큰 저장
        // - [1-1] 상단 return 주석처리 ---> .setSubject(memail) 빨간줄 발생
        // (1) Redis에 토큰 저장
        // - opsForValue().set(key,value); , opsForValue(),set(계정식별정보,토큰);
        stringRedisTemplate.opsForValue().set("JWT:" + memail, token, 1, TimeUnit.HOURS);
        // (2) 현재 Redis에 저장된 key들을 확인
        // - .keys("*") : 현재 Redis에 저장된 모든 key 반환
        System.out.println(stringRedisTemplate.keys("*"));
        // (3) 현재  Redis에 저장된 특정한 key의 rkqt ghkrdls .opsForValue().get(key);
        System.out.println(stringRedisTemplate.opsForValue().get("JWT:" + memail));

        return token;
    }


    // [2] JWT 토큰 검증
    public String validateToken(String token) {
        try {
            // - parser() : JWT 토큰 검증하기 위한 함수
            Claims claims = Jwts.parser()
                    // - .setSigningKey(비밀키) : 검증에 필요한 비밀키 지정.
                    .setSigningKey(secretKey)
                    // - 검증을 실행할 객체 생성 ,
                    .build()
                    // - 검증에 사용할 토큰 지정
                    .parseClaimsJws(token)
                    // - 검증된 (claims) 객체 생성 후 반환
                    .getBody();
            // claims 안에는 다양한 토큰 정보 들어있다.
            // - 토큰에 저장된(로그인 처리된) 회원이메일
            // - .getSubject() : 검증된 토큰 객체의 subject(내용물) 반환
            System.out.println(claims.getSubject());

            // [2-2] 중복 로그인 방지하고자 Redis 에서 최근 로그인된 토근 확인
            // (1) - 현재 전달받은 토큰이 저장된 회원정보(이메일)
            String memail = claims.getSubject();
            // (2) - Redis 에서 최신 토큰 가져오기
            String redisToken = stringRedisTemplate.opsForValue().get("JWT:" + memail);
            // (3) - 현재 전달받은 토큰과 레디스에 저장된 토큰 비교 , 만약에 두 토큰이 같다면
            if (token.equals(redisToken)) {
                return memail;
            }
            // (4) - 만약에 두 토큰이 다르면 아래 코드에 null이 리턴 , (왜? 토큰불일치 또는 중복 로그인 감지)
            else {
                System.out.println(">>중복 로그인 감지됨<<");
            }
            // [1-3]을 쓰기 위해 주석처리
            // return claims.getSubject();
        } catch (ExpiredJwtException e) {
            // - 토큰이 만료 되었을때 예외 클래스
            System.out.println(" >> jwt 토큰 기한 만료 : " + e);
        } catch (JwtException e) {
            // - 그이외 모든 토큰 예외 클래스
            System.out.println(" >> jwt 예외 : " + e);

        } // 유효하지 않은 토큰 또는 오류 발생시 null 반환
        return null;


    }

    // [3] 로그아웃 시 redis에 저장된 토큰 삭제 서비스
    public void deleteToken(String memail) {
        stringRedisTemplate.delete("JWT:" + memail);
    }
}