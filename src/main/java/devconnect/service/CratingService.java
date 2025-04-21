package devconnect.service;

import devconnect.model.dto.CratingDto;
import devconnect.model.repository.CratingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CratingService {

    private final CratingRepository cratingRepository;
    
    // 기업 평가 등록
    public boolean cratingWrite(CratingDto cratingDto ){
        System.out.println("CratingService.cratingWrite");
        return true;
    } // f end
    
    // 기업 평가 전체 조회
    public List<CratingDto> cratingList(){
        System.out.println("CratingService.cratingList");
        return null;
    } // f end
    
    // 기업 평가 수정
    public boolean cratingUpdate( CratingDto cratingDto ){
        System.out.println("CratingService.cratingUpdate");
        return true;
    } // f end

    // 기업 평가 삭제
    public boolean cratingDelete( int crno ){
        System.out.println("CratingService.cratingDelete");
        return true;
    } // f end

} // c end
