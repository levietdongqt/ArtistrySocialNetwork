package com.mytech.mainservice.repository;

import com.mytech.mainservice.model.Template;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository

public interface ITemplateRepository extends JpaRepository<Template, Long> {
}