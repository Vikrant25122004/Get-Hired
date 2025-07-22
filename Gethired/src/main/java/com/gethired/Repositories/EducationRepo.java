package com.gethired.Repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gethired.Entities.Education;

@Repository
public interface EducationRepo extends MongoRepository<Education, ObjectId>{
    
}
