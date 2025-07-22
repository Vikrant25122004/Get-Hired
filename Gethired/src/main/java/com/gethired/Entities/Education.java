package com.gethired.Entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Education {
    
    @Id
    private ObjectId id;
    private String username;
    private String institute;
    private String Degree;
    private String startDate;
    private String endDate;
}
