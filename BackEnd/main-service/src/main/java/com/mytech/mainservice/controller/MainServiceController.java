package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.MainServiceDTO;
import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.dto.SaveServiceDTO;
import com.mytech.mainservice.service.IMainSerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("main-service")
@Slf4j
public class MainServiceController {

    @Autowired
    private IMainSerService mainService2;

    @GetMapping("/get/{serviceId}")
    public ResponseEntity<?> getById(@PathVariable("serviceId") long serviceId) {
        MainServiceDTO mainServiceDTO = mainService2.getById(serviceId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Service successfully")
                        .data(mainServiceDTO).build()
        );
    }

    @GetMapping("/get-all/{userId}")
    public ResponseEntity<?> getAllByUserId(@PathVariable("userId") String userId) {
        Set<MainServiceDTO> mainServiceDTOs = mainService2.getMainServices(userId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Service successfully")
                        .data(mainServiceDTOs).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @GetMapping("/getAllSavedMainService/{userId}")
    public ResponseEntity<?> getAllSavedByUserId(@PathVariable("userId") String userId, @RequestParam("limit") int limit, @RequestParam("pageIndex") int pageIndex) {
        List<MainServiceDTO> mainServiceDTOs = mainService2.findMainServiceSavedByUserId(userId,limit,pageIndex);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Get Saved Service successfully")
                        .data(mainServiceDTOs).build()
        );
    }
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#userId) && hasRole('USER')")
    @DeleteMapping("/deleteAllSaved/{userId}")
    public ResponseEntity<?> DeleteMainService(@PathVariable("userId") String userId) {
        mainService2.deleteAllSaved(userId);
        log.info("Delete all saved service successfully");
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete All saved Service successfully")
                        .data(null).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#mainServiceDTO.provider.id) && hasRole('PROVIDER')")
    @PostMapping("/create")
    public ResponseEntity<?> createMainService(@RequestBody MainServiceDTO mainServiceDTO) {
        mainService2.createMainService(mainServiceDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Create Service successfully")
                        .data(null).build()
        );
    }

    @PreAuthorize("@jwtTokenHolder.isValidUserId(#saveServiceDTO.userId) && hasRole('USER')")
    @PostMapping("/save-services")
    public ResponseEntity<?> createMainService(@RequestBody SaveServiceDTO saveServiceDTO) {
        mainService2.saveMainService(saveServiceDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Save Service successfully")
                        .data(null).build()
        );
    }

    @PreAuthorize("hasRole('PROVIDER')")
    @PostMapping("/soft-delete/{serviceId}")
    public ResponseEntity<?> deleteMainService(@PathVariable Long serviceId) {
        mainService2.deleteService(serviceId);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.CREATED)
                        .message("Delete Service successfully")
                        .data(null).build()
        );
    }
    @PreAuthorize("@jwtTokenHolder.isValidUserId(#mainServiceDTO.provider.id) && hasRole('PROVIDER')")
    @PutMapping("/update")
    public ResponseEntity<?> updateMainService(@RequestBody MainServiceDTO mainServiceDTO) {
        mainService2.updateService(mainServiceDTO);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Update Service successfully")
                        .data(null).build()
        );
    }
}
