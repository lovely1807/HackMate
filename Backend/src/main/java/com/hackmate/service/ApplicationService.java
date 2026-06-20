package com.hackmate.service;

import com.hackmate.dto.ApplicationDTO;
import com.hackmate.dto.UserDTO;
import com.hackmate.entity.Application;
import com.hackmate.entity.Notification;
import com.hackmate.entity.Project;
import com.hackmate.entity.User;
import com.hackmate.repository.ApplicationRepository;
import com.hackmate.repository.NotificationRepository;
import com.hackmate.repository.ProjectRepository;
import com.hackmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final NotificationRepository notificationRepository;
    private final UserService userService;
    private final ProjectService projectService;

    public List<ApplicationDTO> getApplicationsForProject(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        if (!project.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized");
        }
        return applicationRepository.findByProjectId(projectId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDTO acceptApplication(Long applicationId, String username) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        Project project = application.getProject();
        if (!project.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized");
        }
        application.setStatus("Accepted");
        applicationRepository.save(application);
        // Send notification
        Notification notification = Notification.builder()
                .user(application.getUser())
                .message("Your application for " + project.getTitle() + " has been accepted!")
                .read(false)
                .build();
        notificationRepository.save(notification);
        return mapToDTO(application);
    }

    @Transactional
    public ApplicationDTO rejectApplication(Long applicationId, String username) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        Project project = application.getProject();
        if (!project.getOwner().getUsername().equals(username)) {
            throw new RuntimeException("Not authorized");
        }
        application.setStatus("Rejected");
        applicationRepository.save(application);
        // Send notification
        Notification notification = Notification.builder()
                .user(application.getUser())
                .message("Your application for " + project.getTitle() + " has been rejected.")
                .read(false)
                .build();
        notificationRepository.save(notification);
        return mapToDTO(application);
    }

    private ApplicationDTO mapToDTO(Application app) {
        UserDTO user = userService.getUserById(app.getUser().getId());
        return ApplicationDTO.builder()
                .id(app.getId())
                .user(user)
                .project(projectService.mapToDTO(app.getProject()))
                .message(app.getMessage())
                .status(app.getStatus())
                .createdAt(app.getCreatedAt())
                .build();
    }
}
