package com.hackmate.repository;

import com.hackmate.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    
    List<Team> findByLeaderId(Long leaderId);
    
    @Query("SELECT t FROM Team t JOIN t.requiredSkills s WHERE s.name IN :skillNames")
    List<Team> findByRequiredSkillsNameIn(@Param("skillNames") List<String> skillNames);
    
    @Query("SELECT t FROM Team t WHERE t.isOpen = true")
    List<Team> findOpenTeams();
}
