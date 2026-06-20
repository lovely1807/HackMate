package com.hackmate.controller;

import com.hackmate.dto.*;
import com.hackmate.security.SecurityUtils;
import com.hackmate.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {
    
    private final ProjectService projectService;
    private final SecurityUtils securityUtils;
    
    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@Valid @RequestBody CreateProjectRequest request) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(projectService.createProject(username, request));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }
    
    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getAllProjects(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status
    ) {
        if (category != null) {
            return ResponseEntity.ok(projectService.getProjectsByCategory(category));
        }
        if ("open".equals(status)) {
            return ResponseEntity.ok(projectService.getOpenProjects());
        }
        return ResponseEntity.ok(projectService.getAllProjects());
    }
    
    @GetMapping("/open")
    public ResponseEntity<List<ProjectDTO>> getOpenProjects() {
        return ResponseEntity.ok(projectService.getOpenProjects());
    }
    
    @GetMapping("/my-projects")
    public ResponseEntity<List<ProjectDTO>> getMyProjects() {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(projectService.getMyProjects(username));
    }
    
    @GetMapping("/{id}/match")
    public ResponseEntity<Map<String, Double>> getSkillMatch(@PathVariable Long id) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(projectService.getSkillMatch(id, username));
    }
    
    @PostMapping("/{id}/apply")
    public ResponseEntity<ApplicationDTO> applyToProject(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body
    ) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        String message = body.get("message");
        return ResponseEntity.ok(projectService.applyToProject(id, username, message));
    }
}
