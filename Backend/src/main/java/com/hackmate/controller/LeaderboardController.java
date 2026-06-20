package com.hackmate.controller;

import com.hackmate.dto.UserDTO;
import com.hackmate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<UserDTO>> getLeaderboard() {
        List<UserDTO> users = userService.getAllUsers();
        users.sort((a, b) -> b.getRating() != null && a.getRating() != null ? b.getRating().compareTo(a.getRating()) : 0);
        return ResponseEntity.ok(users);
    }
}
