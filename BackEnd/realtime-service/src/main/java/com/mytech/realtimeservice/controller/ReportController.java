package com.mytech.realtimeservice.controller;

import com.mytech.realtimeservice.dto.ReportDTO;
import com.mytech.realtimeservice.dto.ResponseObject;
import com.mytech.realtimeservice.services.IReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/reports")
public class ReportController {

    @Autowired
    private IReportService reportService;

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#reportDTO.userId) && hasRole('USER')")
    @PostMapping("/createReport")
    public ResponseEntity<?> createReport(@RequestBody ReportDTO reportDTO){
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("create report ok ")
                        .data(reportService.createReport(reportDTO))
                        .build()
        );
    }
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @PutMapping("/undoReport")
    public ResponseEntity<?> undoReport(@RequestParam("userId") String userId, @RequestParam("postId") String postId){
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("change report undo status ")
                        .data(reportService.changeReportUndo(userId, postId))
                        .build()
        );
    }

    @GetMapping("/listReports")
    public ResponseEntity<?> listReport(){
        return ResponseEntity.status(HttpStatus.CREATED).body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("get list report ok ")
                        .data(reportService.findAll())
                        .build()
        );
    }
}
