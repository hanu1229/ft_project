/*
 * AdminEntityService 인터페이스 | rw 25-04-19 생성
 * - 관리자 관련 비즈니스 로직 인터페이스 정의
 * - 구현체는 AdminEntityServiceImpl 에서 수행
 * - 회원가입, 로그인, 단건 조회 기능 포함
*/

package devconnect.service;

import devconnect.model.dto.AdminDto;

public interface AdminEntityService { // CS

    // [1] 관리자 회원가입 기능
    boolean signUp(AdminDto dto);

    // [2] 로그인 기능
    String login(AdminDto dto);

    // [3] 관리자 단건 조회
    AdminDto findByAdid(String adid);

} // CE