package com.example.recruiment_management.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.recruiment_management.Model.BaiDang;
import com.example.recruiment_management.Repository.BaiDangRepository;

@Service
public class BaiDangService {

    @Autowired
    private BaiDangRepository baiDangRepository;

    
    // Lưu tin tuyển dụng vào database
    public void saveJobPost(BaiDang baiDang) {
        try {
            // Log dữ liệu trước khi lưu
            System.out.println("Lưu tin tuyển dụng: " + baiDang.toString());

            // Lưu tin tuyển dụng vào DB
            baiDangRepository.save(baiDang);

            // Log khi đã lưu thành công
            System.out.println("Tin tuyển dụng đã được lưu thành công.");
        } catch (Exception e) {
            // Log lỗi nếu xảy ra vấn đề khi lưu
            System.err.println("Có lỗi khi lưu tin tuyển dụng: " + e.getMessage());
            throw e; // Để lỗi được ném lên trên nếu cần xử lý thêm
        }
    }

    // Lấy tất cả tin tuyển dụng
    public List<BaiDang> getAllJobPosts() {
        return baiDangRepository.findAll();
    }
}