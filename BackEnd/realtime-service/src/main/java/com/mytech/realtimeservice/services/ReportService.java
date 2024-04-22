package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ReportDTO;
import com.mytech.realtimeservice.enums.ReportStatus;
import com.mytech.realtimeservice.exception.myException.NotFoundException;
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
    public List<Report> findReportsByUserId(String userId){
        return reportRepository.findReportByUserId(userId);
    }
    public void deleteReportByUserId(String userId,String postId){
        Optional<Report> report = reportRepository.findByUserIdandPostId(userId,postId);
        report.ifPresent(value -> reportRepository.delete(value));
    }
    public Report createReport(ReportDTO reportDTO) {
        Optional<Report> existingReport = reportRepository.findByUserIdandPostId(reportDTO.getUserId(),reportDTO.getPostId());
        if (existingReport.isPresent()) {
            Report currentReport = existingReport.get();
            currentReport.setContent(reportDTO.getContent());
            currentReport.setTitle(reportDTO.getTitle());
            currentReport.setStatus(ReportStatus.PENDING);
            currentReport.setCreateAt(LocalDateTime.now());
            return reportRepository.save(currentReport);
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
    public Report changeReportUndo(String userId, String postId){
        Optional<Report> existingReport = reportRepository.findByUserIdandPostId(userId,postId);
        if (existingReport.isPresent()) {
            Report reportGet = existingReport.get();
            reportGet.setStatus(ReportStatus.UNDO);
            reportRepository.save(reportGet);
            return reportGet;
        }
        throw new NotFoundException("Report not found");
    }

    public List<Report> findAll() {
        return reportRepository.findAll();
    }




}
