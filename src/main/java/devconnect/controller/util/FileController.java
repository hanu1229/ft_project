package devconnect.controller.util;

import devconnect.service.util.FileService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    // 1. 업로드\
    @PostMapping("/upload")
    public String fileUpload( MultipartFile multipartFile ){
        System.out.println("FileController.fileUpload");
        System.out.println("multipartFile = " + multipartFile);
        String result = fileService.fileUpload( multipartFile );
        return result;
    } // f end

    // 2. 업로드된 파일 다운로드
    @PostMapping("/download")
    public void fileDownload(String fileName, HttpServletResponse resp ){
        fileService.fileDownload( fileName, resp );
    } // f end

    // 3. 업로드된 파일 삭제
    @GetMapping("/delete")
    public boolean fileDelete( String fileName ){
        boolean result = fileService.fileDelete( fileName );
        return result;
    } // f end

}
