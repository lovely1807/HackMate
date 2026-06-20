package com.hackmate.service;

import com.hackmate.dto.*;
import com.hackmate.entity.Skill;
import com.hackmate.entity.Team;
import com.hackmate.entity.User;
import com.hackmate.repository.SkillRepository;
import com.hackmate.repository.TeamRepository;
import com.hackmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TeamService {
    
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final SkillRepository skillRepository;
    
    @Transactional
    public TeamDTO createTeam(String username, CreateTeamRequest request) {
        User leader = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Set<Skill> skills = new HashSet<>();
        if (request.getRequiredSkills() != null) {
            for (String skillName : request.getRequiredSkills()) {
                Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName).build()));
                skills.add(skill);
            }
        }
        
        Team team = Team.builder()
                .name(request.getName())
                .description(request.getDescription())
                .projectName(request.getProjectName())
                .maxMembers(request.getMaxMembers() != null ? request.getMaxMembers() : 4)
                .leader(leader)
                .requiredSkills(skills)
                .isOpen(request.getIsOpen() != null ? request.getIsOpen() : true)
                .build();
        
        team.getMembers().add(leader);
        
        return mapToDTO(teamRepository.save(team));
    }
    
    public TeamDTO getTeamById(Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return mapToDTO(team);
    }
    
    public List<TeamDTO> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TeamDTO> getTeamsByLeader(String username) {
        User leader = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return teamRepository.findByLeaderId(leader.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TeamDTO> searchTeamsBySkills(List<String> skillNames) {
        return teamRepository.findByRequiredSkillsNameIn(skillNames).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<TeamDTO> getOpenTeams() {
        return teamRepository.findOpenTeams().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public TeamDTO joinTeam(Long teamId, String username) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (team.getMembers().size() >= team.getMaxMembers()) {
            throw new RuntimeException("Team is full");
        }
        
        if (!team.getIsOpen()) {
            throw new RuntimeException("Team is not open for new members");
        }
        
        team.getMembers().add(user);
        return mapToDTO(teamRepository.save(team));
    }
    
    @Transactional
    public TeamDTO leaveTeam(Long teamId, String username) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (team.getLeader().equals(user)) {
            throw new RuntimeException("Leader cannot leave the team");
        }
        
        team.getMembers().remove(user);
        return mapToDTO(teamRepository.save(team));
    }
    
    private TeamDTO mapToDTO(Team team) {
        return TeamDTO.builder()
                .id(team.getId())
                .name(team.getName())
                .description(team.getDescription())
                .projectName(team.getProjectName())
                .maxMembers(team.getMaxMembers())
                .leaderUsername(team.getLeader().getUsername())
                .leaderId(team.getLeader().getId())
                .members(team.getMembers().stream().map(User::getUsername).collect(Collectors.toSet()))
                .requiredSkills(team.getRequiredSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                .isOpen(team.getIsOpen())
                .createdAt(team.getCreatedAt())
                .build();
    }
}
