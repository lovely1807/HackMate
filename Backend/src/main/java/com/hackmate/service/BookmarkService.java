package com.hackmate.service;

import com.hackmate.dto.ProjectDTO;
import com.hackmate.entity.Bookmark;
import com.hackmate.entity.Project;
import com.hackmate.entity.User;
import com.hackmate.repository.BookmarkRepository;
import com.hackmate.repository.ProjectRepository;
import com.hackmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final ProjectService projectService;

    public List<ProjectDTO> getUserBookmarks(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookmarkRepository.findByUser(user).stream()
                .map(Bookmark::getProject)
                .map(projectService::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void toggleBookmark(String username, Long projectId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        if (bookmarkRepository.existsByUserAndProject(user, project)) {
            Bookmark existing = bookmarkRepository.findByUserAndProject(user, project).get();
            bookmarkRepository.delete(existing);
        } else {
            Bookmark newBookmark = Bookmark.builder()
                    .user(user)
                    .project(project)
                    .build();
            bookmarkRepository.save(newBookmark);
        }
    }

    public boolean isBookmarked(String username, Long projectId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return bookmarkRepository.existsByUserAndProject(user, project);
    }
}
