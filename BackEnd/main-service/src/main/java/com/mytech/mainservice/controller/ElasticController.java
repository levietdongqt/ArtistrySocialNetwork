package com.mytech.mainservice.controller;

import com.mytech.mainservice.dto.ResponseObject;
import com.mytech.mainservice.model.elasticsearch.PostELS;
import com.mytech.mainservice.service.IELSService;
import com.mytech.mainservice.service.implement.ELSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/elasticsearch")
public class ElasticController {

    @Autowired
    private IELSService elsService;

    @PostMapping("/posts")
    public ResponseEntity<?> savePostELS(@RequestBody PostELS postELS){
        elsService.savePostELS(postELS);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Tạo postELS thành công")
                        .data(null)
                        .build()
        );
    }
    @DeleteMapping("/posts/{id}")
    public ResponseEntity<?> deletePostELS(@PathVariable String id){
        elsService.deletePostELSById(id);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Delete postELS thành công")
                        .data(null)
                        .build()
        );
    }

    @GetMapping()
    public ResponseEntity<?> suggestKeyword(@Param("q") String q){
        var result = elsService.suggestsKeyword(q);
        return ResponseEntity.ok().body(
                ResponseObject.builder()
                        .status(HttpStatus.OK)
                        .message("Search postELS thành công")
                        .data(result)
                        .build());
    }


}
