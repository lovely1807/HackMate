package com.hackmate.controller;

import com.hackmate.dto.CreateTeamRequest;
import com.hackmate.dto.TeamDTO;
import com.hackmate.security.SecurityUtils;
import com.hackmate.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {
    
    private final TeamService teamService;
    private final SecurityUtils securityUtils;
    
    @PostMapping
    public ResponseEntity<TeamDTO> createTeam(@Valid @RequestBody CreateTeamRequest request) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(teamService.createTeam(username, request));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeamById(@PathVariable Long id) {
        return ResponseEntity.ok(teamService.getTeamById(id));
    }
    
    @GetMapping
    public ResponseEntity<List<TeamDTO>> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }
    
    @GetMapping("/open")
    public ResponseEntity<List<TeamDTO>> getOpenTeams() {
        return ResponseEntity.ok(teamService.getOpenTeams());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<TeamDTO>> searchTeamsBySkills(@RequestParam List<String> skills) {
        return ResponseEntity.ok(teamService.searchTeamsBySkills(skills));
    }
    
    @GetMapping("/my-teams")
    public ResponseEntity<List<TeamDTO>> getMyTeams() {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(teamService.getTeamsByLeader(username));
    }
    
    @PostMapping("/{id}/join")
    public ResponseEntity<TeamDTO> joinTeam(@PathVariable Long id) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(teamService.joinTeam(id, username));
    }
    
    @PostMapping("/{id}/leave")
    public ResponseEntity<TeamDTO> leaveTeam(@PathVariable Long id) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(teamService.leaveTeam(id, username));
    }
}
