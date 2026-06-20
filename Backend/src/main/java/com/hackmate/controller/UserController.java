package com.hackmate.controller;

import com.hackmate.dto.TeamDTO;
import com.hackmate.dto.UpdateProfileRequest;
import com.hackmate.dto.UserDTO;
import com.hackmate.security.SecurityUtils;
import com.hackmate.service.TeamService;
import com.hackmate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    private final TeamService teamService;
    private final SecurityUtils securityUtils;
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }
    
    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getUserByUsername(username));
    }
    
    @GetMapping("/{username}/teams")
    public ResponseEntity<List<TeamDTO>> getUserTeams(@PathVariable String username) {
        return ResponseEntity.ok(teamService.getTeamsByLeader(username));
    }
    
    @PutMapping("/me")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UpdateProfileRequest request) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(userService.updateProfile(username, request));
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<UserDTO>> searchBySkills(@RequestParam List<String> skills) {
        return ResponseEntity.ok(userService.searchBySkills(skills));
    }
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }
}
