package com.hackmate.controller;

import com.hackmate.dto.NotificationDTO;
import com.hackmate.security.SecurityUtils;
import com.hackmate.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getUserNotifications() {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(notificationService.getUserNotifications(username));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
