package com.gethired.Repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gethired.Entities.Experience;

@Repository
public interface ExperienceRepo extends MongoRepository<Experience,ObjectId> {

    
}
