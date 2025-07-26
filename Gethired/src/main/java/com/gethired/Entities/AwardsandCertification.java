package com.gethired.Entities;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
public class AwardsandCertification {
    @Id
    private ObjectId id;
    private String email;
    private String organisation;
    private String course;
    private String rank;
    private byte[] pdfbyte;
    private String pdftype;
    private String pdfname;
    
    
}
