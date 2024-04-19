package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ReportDTO;
import com.mytech.realtimeservice.enums.ReportStatus;
import com.mytech.realtimeservice.models.Report;
import com.mytech.realtimeservice.repositories.ReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ReportService implements IReportService {

    @Autowired
    private ReportRepository reportRepository;

    public Optional<Report> findReportByUserId(String userId,String postId) {
        return reportRepository.findByUserIdandPostId(userId,postId);
    }
    public void deleteReportByUserId(String userId,String postId){
        Optional<Report> report = reportRepository.findByUserIdandPostId(userId,postId);
        report.ifPresent(value -> reportRepository.delete(value));
    }
    public Report createReport(ReportDTO reportDTO) {
        Optional<Report> existingReport = reportRepository.findByUserIdandPostId(reportDTO.getUserId(),reportDTO.getPostId());
        if (existingReport.isPresent()) {
            Report reportGet = existingReport.get();
            reportGet.setStatus(ReportStatus.UNDO);
            reportRepository.save(reportGet);
            return reportGet;
        }
        Report newReport = Report.builder()
                .content(reportDTO.getContent())
                .title(reportDTO.getTitle())
                .userId(reportDTO.getUserId())
                .createAt(LocalDateTime.now())
                .postId(reportDTO.getPostId())
                .status(ReportStatus.PENDING)
                .build();
        return reportRepository.save(newReport);
    }

    public List<Report> findAll() {
        return reportRepository.findAll();
    }




}
