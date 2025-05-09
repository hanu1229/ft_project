package devconnect.util;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetUrlRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLEncoder;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUtil {

    // 자동 설정된 S3Client (AWS SDK v2) 주입
    private final S3Client s3Client;
    // application.properties에서 버킷 이름 주입 (새로운 키 사용)
    @Value("${spring.cloud.aws.s3.bucket}")
    private String bucket;

    /** 파일을 S3에 업로드합니다 (AWS SDK v2 사용).  */
    public String fileUpload(MultipartFile multipartFile) {
        if (multipartFile == null || multipartFile.isEmpty()) {// log.warn("업로드할 파일이 비어 있습니다."); // 로깅 제거
            return null;
        }
        // (*) 동일한 파일명으로 업로드할경우 식별이 불가능하다. 해결방안 : UUID , 식별자 생성
        String uuid = UUID.randomUUID().toString(); //  UUID 규약에 따른 난수 문자열 생성 ( 고유성 보장 )
        // (*) uuid 와(+) 파일명( 파일명에 _언더바가 존재하면 -하이픈 으로 모두 변경 ) , _언더바는 uuid와파일명 구분하는 용도
        String objectKey = uuid + "_" + multipartFile.getOriginalFilename().replaceAll("_","-");
        try (InputStream inputStream = multipartFile.getInputStream()) {
            // S3에 업로드할 객체 요청 생성 (SDK v2)
            PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .contentType(multipartFile.getContentType())
                    .acl(ObjectCannedACL.PUBLIC_READ) // 필요시 접근 권한 설정 (Public Read)
                    .build();
            // 파일 업로드 실행 (SDK v2)
            s3Client.putObject(putObjectRequest,
                    RequestBody.fromInputStream(inputStream, multipartFile.getSize()));
            // 업로드된 객체의 URL 가져오기 (SDK v2)
            GetUrlRequest getUrlRequest = GetUrlRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .build();
            String fileUrl = s3Client.utilities().getUrl(getUrlRequest).toString();
            return fileUrl;
        }catch (Exception e) { // 기타 예외 처리
            System.err.println("Unexpected error during upload: " + e.getMessage()); // 간단한 표준 에러 출력 (디버깅용)
            return null;
        }
    }

    /**S3에서 객체(파일)를 삭제합니다 (AWS SDK v2 사용). */
    public boolean fileDelete(String objectKey) {
        if (objectKey == null || objectKey.isBlank()) {  // log.warn("삭제할 객체 키가 null이거나 비어있습니다."); // 로깅 제거
            return false;
        }
        try {
            objectKey = objectKey.split("/")[objectKey.split("/").length-1];
            // 삭제 요청 객체 생성 (SDK v2)
            DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
                    .bucket(bucket)
                    .key(objectKey)
                    .build();
            // 객체 삭제 실행 (SDK v2)
            s3Client.deleteObject(deleteObjectRequest);
            return true;
        } catch (Exception e) { // 기타 예외 처리
            // log.error("S3 삭제 중 예상치 못한 오류 발생 (키: {}): {}", objectKey, e.getMessage(), e); // 로깅 제거
            System.err.println("Unexpected error during delete: " + e.getMessage()); // 간단한 표준 에러 출력 (디버깅용)
            return false;
        }
    }



    /*
    // 경로
    String baseDir = System.getProperty("user.dir");
    String uploadPath = baseDir + "/build/resources/main/static/upload/";

    // 1. 업로드
    public String fileUpload( MultipartFile multipartFile ){
        String uuid = UUID.randomUUID().toString();
        String fileName = uuid + "_" + multipartFile.getOriginalFilename().replaceAll("_", "-");
        String filePath = uploadPath + fileName;
            File file2 = new File( uploadPath );
            if( file2.exists() ){ file2.mkdir(); }
        File file = new File( filePath );
        try{ multipartFile.transferTo( file );
        }catch ( IOException e ){ System.out.println( e ); }
        return fileName;
    }

    // 1. 업로드
    public String fileUploadProjectImage( MultipartFile multipartFile ){
        String uuid = UUID.randomUUID().toString();
        String fileName = uuid + "_" + multipartFile.getOriginalFilename().replaceAll("_", "-");
        String filePath = uploadPath + "project_image/" + fileName;
        File file2 = new File( uploadPath );
        if( file2.exists() ){ file2.mkdir(); }
        File file = new File( filePath );
        try{ multipartFile.transferTo( file );
        }catch ( IOException e ){ System.out.println( e ); }
        return fileName;
    }

    // 2. 업로드된 파일 다운로드
    public void fileDownload(String fileName, HttpServletResponse resp ){
        String downloadPath = uploadPath + fileName;
        File file = new File( downloadPath );
        if( !file.exists() ){ return; }

        try{
            FileInputStream fin = new FileInputStream( downloadPath );
            long fileSize = file.length();
            byte[] bytes = new byte[ (int)fileSize ];

            fin.read( bytes );
            fin.close();

            String oldFileName = URLEncoder.encode( fileName.split("_")[1], "UTF-8" );
            resp.setHeader( "Content-Disposition", "attachment; filename=" + oldFileName );

            ServletOutputStream fout = resp.getOutputStream();
            fout.write( bytes );
            fout.close();
        }catch( Exception e ){  }
    } // f end

    // 3. 업로드된 파일 삭제
    public boolean fileDelete( String fileName ){
        String filePath = uploadPath + fileName;
        File file = new File( filePath );
        if( file.exists() ){
            file.delete();
            return true;
        }
        return false;
    } // f end

    */

}
