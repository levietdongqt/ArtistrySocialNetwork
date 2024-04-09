package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.ExtraServiceDTO;
import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.service.IExtraSerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("extra-service")
public class ExtraServiceController {

    @Autowired
    private IExtraSerService extraService;

    @GetMapping("/get/{serviceId}")
    public ResponseEntity<?> getById(@PathVariable("serviceId") long serviceId) {
        ExtraServiceDTO mainServiceDTO = extraService.getById(serviceId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Service successfully")
                        .data(mainServiceDTO).build()
        );
    }

    @GetMapping("/get-all/{userId}")
    public ResponseEntity<?> getAllByUserId(@PathVariable("userId") String userId) {
        Set<ExtraServiceDTO> mainServiceDTOs = extraService.getMainServices(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Service successfully")
                        .data(mainServiceDTOs).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#extraServiceDTO.provider.id) && hasRole('PROVIDER')")
    @PostMapping("/create")
    public ResponseEntity<?> createMainService(@RequestBody ExtraServiceDTO extraServiceDTO) {
        extraService.createExtraService(extraServiceDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Create Service successfully")
                        .data(null).build()
        );
    }

    @PreAuthorize("hasRole('PROVIDER')")
    @PostMapping("/soft-delete/{serviceId}")
    public ResponseEntity<?> deleteMainService(@PathVariable Long serviceId) {
        extraService.deleteService(serviceId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Delete Service successfully")
                        .data(null).build()
        );
    }
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#extraServiceDTO.provider.id) && hasRole('PROVIDER')")
    @PutMapping("/update")
    public ResponseEntity<?> updateMainService(@RequestBody ExtraServiceDTO extraServiceDTO) {
        extraService.updateService(extraServiceDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Update Service successfully")
                        .data(null).build()
        );
    }
}
