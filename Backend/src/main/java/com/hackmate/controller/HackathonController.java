package com.hackmate.controller;

import com.hackmate.dto.HackathonDTO;
import com.hackmate.service.HackathonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hackathons")
@RequiredArgsConstructor
public class HackathonController {
    
    private final HackathonService hackathonService;
    
    @GetMapping
    public ResponseEntity<List<HackathonDTO>> getAllHackathons() {
        return ResponseEntity.ok(hackathonService.getAllHackathons());
    }
}
