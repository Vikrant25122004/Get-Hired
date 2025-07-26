package com.gethired.Entities;

import java.util.ArrayList;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Skills {
    @Id
    private ObjectId id;
    private String email;
    private ArrayList<String> skills;
    
}
