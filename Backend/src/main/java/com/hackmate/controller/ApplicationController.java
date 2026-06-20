package com.hackmate.controller;

import com.hackmate.dto.ApplicationDTO;
import com.hackmate.security.SecurityUtils;
import com.hackmate.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final SecurityUtils securityUtils;

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<ApplicationDTO>> getApplicationsForProject(@PathVariable Long projectId) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(applicationService.getApplicationsForProject(projectId, username));
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<ApplicationDTO> acceptApplication(@PathVariable Long id) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(applicationService.acceptApplication(id, username));
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<ApplicationDTO> rejectApplication(@PathVariable Long id) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(applicationService.rejectApplication(id, username));
    }
}
