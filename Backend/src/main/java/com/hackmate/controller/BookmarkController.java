package com.hackmate.controller;

import com.hackmate.dto.ProjectDTO;
import com.hackmate.security.SecurityUtils;
import com.hackmate.service.BookmarkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookmarks")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;
    private final SecurityUtils securityUtils;

    @GetMapping
    public ResponseEntity<List<ProjectDTO>> getUserBookmarks() {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(username));
    }

    @PostMapping("/{projectId}/toggle")
    public ResponseEntity<Map<String, Object>> toggleBookmark(@PathVariable Long projectId) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        bookmarkService.toggleBookmark(username, projectId);
        boolean isBookmarked = bookmarkService.isBookmarked(username, projectId);
        return ResponseEntity.ok(Map.of("success", true, "isBookmarked", isBookmarked));
    }

    @GetMapping("/{projectId}/check")
    public ResponseEntity<Map<String, Boolean>> isBookmarked(@PathVariable Long projectId) {
        String username = securityUtils.getCurrentUsername().orElseThrow();
        return ResponseEntity.ok(Map.of("isBookmarked", bookmarkService.isBookmarked(username, projectId)));
    }
}
