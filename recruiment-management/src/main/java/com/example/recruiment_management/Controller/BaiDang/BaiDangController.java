package com.example.recruiment_management.Controller.BaiDang;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.recruiment_management.Model.BaiDang;
import com.example.recruiment_management.Service.BaiDangService;

@Controller     
@RequestMapping("/recruiter")
public class BaiDangController {
    
    @Autowired
    private BaiDangService baiDangService;
    
     // Endpoint hiển thị trang recruiter (Danh sách tin tuyển dụng)
     @GetMapping
     public String showRecruiterPage(Model model) {
         // Lấy danh sách tin tuyển dụng từ database
         model.addAttribute("jobPosts", baiDangService.getAllJobPosts());
         return "recruiter"; // Trả về trang recruiter.html
     }
 
     @PostMapping("/create-job")
     @ResponseBody
     public ResponseEntity<?> createJobPost(@RequestBody BaiDang baiDang) {
         try {
             // Validation dữ liệu
             if (baiDang.getJobQuantity() <= 0) {
                 return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Số lượng cần tuyển phải lớn hơn 0.");
             }
             // Lưu thông tin tin tuyển dụng
             baiDangService.saveJobPost(baiDang);
             return ResponseEntity.status(HttpStatus.CREATED).body("Tin tuyển dụng đã được tạo thành công!");
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Có lỗi xảy ra khi tạo tin tuyển dụng.");
         }
     }
     
     @GetMapping("/job-posts")
     public ResponseEntity<List<BaiDang>> getAllJobPosts() {
         try {
             List<BaiDang> baiDangList = baiDangService.getAllJobPosts();  // Dùng service để lấy dữ liệu
             return ResponseEntity.ok(baiDangList);  // Trả về danh sách bài đăng
         } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                     .body(null);  // Trả về lỗi nếu không lấy được dữ liệu
         }
     }
     
}
