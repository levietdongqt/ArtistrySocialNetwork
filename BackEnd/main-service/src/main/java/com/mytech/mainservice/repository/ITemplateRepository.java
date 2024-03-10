package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ITemplateRepository extends JpaRepository<Template, Long> {
}