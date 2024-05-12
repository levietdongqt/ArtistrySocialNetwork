package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.dto.WorkingTimeDTO;
import com.mytech.mainservice.service.IWorkingTimeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("working-time")
public class WorkingTimeController {

    @Autowired
    private IWorkingTimeService workingTimeService;

    @GetMapping("/{userId}/get-all-by-status")
    public ResponseEntity<?> getWorkingTimesByStatus(@PathVariable("userId") String userId, @Param("status") boolean status) {
        List<WorkingTimeDTO> lists = workingTimeService.getAllWorkingTimesByStatus(userId, status);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get WorkingTimeDTO successfully")
                        .data(lists).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('PROVIDER')")
    @GetMapping("/{userId}/get-all")
    public ResponseEntity<?> getAllWorkingTimes(@PathVariable("userId") String userId) {
        List<WorkingTimeDTO> lists = workingTimeService.getAllWorkingTimes(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get WorkingTimeDTO successfully")
                        .data(lists).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('PROVIDER')")
    @PostMapping("/{userId}/save")
    public ResponseEntity<?> createWorkingTime(@PathVariable("userId") String userId, @RequestBody WorkingTimeDTO workingTimeDTO){
        workingTimeService.createWorkingTime(workingTimeDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Create workingTime successfully")
                        .data(null).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('PROVIDER')")
    @PutMapping("/{userId}/update")
    public ResponseEntity<?> updateWorkingTime(@PathVariable("userId") String userId, @RequestBody WorkingTimeDTO workingTimeDTO){
        workingTimeService.updateWorkingTime(workingTimeDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Update workingTime successfully")
                        .data(null).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('PROVIDER')")
    @DeleteMapping("/{userId}/delete/{workingTimeId}")
    public ResponseEntity<?> deleteWorkingTime(@PathVariable("userId") String userId,@PathVariable("workingTimeId") Long workingTimeId){
        workingTimeService.deleteWorkingTime(userId,workingTimeId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete workingTime successfully")
                        .data(null).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('PROVIDER')")
    @PutMapping("/{userId}/rework/{workingTimeId}")
    public ResponseEntity<?> reworkWorkingTime(@PathVariable("userId") String userId,@PathVariable("workingTimeId") Long workingTimeId){
        workingTimeService.updateWorkingTime(userId,workingTimeId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Rework workingTime successfully")
                        .data(null).build()
        );
    }

}
