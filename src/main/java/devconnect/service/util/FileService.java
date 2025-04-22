package devconnect.service.util;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.UUID;

@Service
public class FileService {

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
}
