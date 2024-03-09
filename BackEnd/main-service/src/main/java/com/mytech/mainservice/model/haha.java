package com.mytech.mainservice.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.HashMap;

@Entity
@Table(name = "haha")
public class haha {

    @Id
    private int id;
    public String add(int a , boolean b){
        return "a+b+";
    }

    public static void main(String[] args) {
        HashMap<String,Integer> lisst = new HashMap<String,Integer>();

    }
}
