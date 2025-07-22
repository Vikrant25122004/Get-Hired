package com.gethired.Entities;

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

    private int credits = 3;
  
    
    
    
}
