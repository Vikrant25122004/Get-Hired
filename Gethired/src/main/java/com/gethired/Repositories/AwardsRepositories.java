package com.gethired.Repositories;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gethired.Entities.AwardsandCertification;
@Repository
public interface AwardsRepositories extends MongoRepository<AwardsandCertification, ObjectId>{
    List<AwardsandCertification> findByemail(String email);
    List<AwardsandCertification> findBycourse(String course);
    AwardsandCertification findByCourseAndEmail(String course , String email);
    
}
