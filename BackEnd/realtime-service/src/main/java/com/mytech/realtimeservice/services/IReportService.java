package com.mytech.realtimeservice.services;

import com.mytech.realtimeservice.dto.ReportDTO;
import com.mytech.realtimeservice.models.Report;

import java.util.List;

public interface IReportService  {
    Report createReport(ReportDTO reportDTO);
    List<Report> findAll();
}
