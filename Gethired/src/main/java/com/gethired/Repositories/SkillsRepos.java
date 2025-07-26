package com.gethired.Repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gethired.Entities.Skills;

@Repository
public interface SkillsRepos extends MongoRepository<Skills , ObjectId>{
    Skills findByemail(String email);

}