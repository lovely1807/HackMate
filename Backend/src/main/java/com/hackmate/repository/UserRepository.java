package com.hackmate.repository;

import com.hackmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    Optional<User> findByUsername(String username);
    
    Optional<User> findByEmail(String email);
    
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u JOIN u.skills s WHERE s.name IN :skillNames")
    List<User> findBySkillsNameIn(@Param("skillNames") List<String> skillNames);
    
    @Query("SELECT u FROM User u JOIN u.skills s WHERE s.name = :skillName")
    List<User> findBySkillName(@Param("skillName") String skillName);
}
