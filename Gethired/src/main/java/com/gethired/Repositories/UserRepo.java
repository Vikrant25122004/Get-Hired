package com.gethired.Repositories;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.gethired.Entities.User;
@Repository
public interface UserRepo extends MongoRepository<User,ObjectId>{
     User findByUsername(String username); 
    User findByEmail(String email);   
    
}
