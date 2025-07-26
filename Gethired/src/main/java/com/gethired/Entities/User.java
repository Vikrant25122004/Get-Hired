package com.gethired.Entities;

import java.time.LocalDate;
import java.time.Month;
import java.util.HashMap;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
     @Id
    private ObjectId id;
    @Indexed(unique = true)
    private String username;
    private String name;
    private String password;
    private String email;
    private String phonenumber;
    private String profilpicname;
    private String profilepictype;
    private byte[] profilepicbyte;
    private String address;
    private int appliead =0;
    private int interviewcalls = 0;
    private int offers = 0;
    private int count = 0;
    private int credits = 3;
    private HashMap<LocalDate,Integer> skills = new HashMap<>();
    private HashMap<Integer,Integer> scores = new HashMap<>();
    private int runs = 0;
  
    
    
    
}
