package com.hackmate.service;

import com.hackmate.dto.*;
import com.hackmate.entity.*;
import com.hackmate.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {
    
    private final ProjectRepository projectRepository;
    private final SkillRepository skillRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final ApplicationRepository applicationRepository;
    private final NotificationRepository notificationRepository;
    
    @Transactional
    public ProjectDTO createProject(String username, CreateProjectRequest request) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Set<Skill> requiredSkills = new HashSet<>();
        if (request.getRequiredSkills() != null) {
            for (String skillName : request.getRequiredSkills()) {
                Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName).build()));
                requiredSkills.add(skill);
            }
        }
        
        Set<Skill> techStack = new HashSet<>();
        if (request.getTechStack() != null) {
            for (String skillName : request.getTechStack()) {
                Skill skill = skillRepository.findByName(skillName)
                        .orElseGet(() -> skillRepository.save(Skill.builder().name(skillName).build()));
                techStack.add(skill);
            }
        }
        
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .projectName(request.getProjectName())
                .teamSize(request.getTeamSize())
                .hackathonName(request.getHackathonName())
                .owner(owner)
                .requiredSkills(requiredSkills)
                .techStack(techStack)
                .build();
        
        return mapToDTO(projectRepository.save(project));
    }
    
    public ProjectDTO getProjectById(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        return mapToDTO(project);
    }
    
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProjectDTO> getOpenProjects() {
        return projectRepository.findByStatus("open").stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProjectDTO> getProjectsByCategory(String category) {
        return projectRepository.findByCategory(category).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public List<ProjectDTO> getMyProjects(String username) {
        return projectRepository.findByOwnerUsername(username).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    public Map<String, Double> getSkillMatch(Long projectId, String username) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Set<String> userSkills = user.getSkills().stream().map(Skill::getName).collect(Collectors.toSet());
        Set<String> requiredSkills = project.getRequiredSkills().stream().map(Skill::getName).collect(Collectors.toSet());
        
        if (requiredSkills.isEmpty()) {
            return Collections.singletonMap("matchPercentage", 0.0);
        }
        
        long matchedCount = userSkills.stream().filter(requiredSkills::contains).count();
        double percentage = (matchedCount / (double) requiredSkills.size()) * 100;
        
        return Collections.singletonMap("matchPercentage", Math.round(percentage));
    }
    
    @Transactional
    public ApplicationDTO applyToProject(Long projectId, String username, String message) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        boolean alreadyApplied = applicationRepository.existsByProjectIdAndUserId(projectId, user.getId());
        if (alreadyApplied) {
            throw new RuntimeException("Already applied to this project");
        }
        
        Application application = Application.builder()
                .project(project)
                .user(user)
                .message(message != null ? message : "I would love to join!")
                .status("pending")
                .build();
        applicationRepository.save(application);
        
        Notification notification = Notification.builder()
                .user(project.getOwner())
                .message(user.getUsername() + " applied to your project " + project.getTitle() + "!")
                .read(false)
                .build();
        notificationRepository.save(notification);
        
        return ApplicationDTO.builder()
                .id(application.getId())
                .user(userService.getUserById(user.getId()))
                .project(mapToDTO(project))
                .message(application.getMessage())
                .status(application.getStatus())
                .createdAt(application.getCreatedAt())
                .build();
    }
    
    public ProjectDTO mapToDTO(Project project) {
        List<UserDTO> members = project.getMembers().stream()
                .map(userService::getUserById)
                .toList();
        Integer applicantCount = applicationRepository.findByProjectId(project.getId()).size();
        
        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .category(project.getCategory())
                .projectName(project.getProjectName())
                .teamSize(project.getTeamSize())
                .hackathonName(project.getHackathonName())
                .githubUrl(project.getGithubUrl())
                .linkedinUrl(project.getLinkedinUrl())
                .deadline(project.getDeadline())
                .owner(userService.getUserById(project.getOwner().getId()))
                .requiredSkills(project.getRequiredSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                .techStack(project.getTechStack().stream().map(Skill::getName).collect(Collectors.toSet()))
                .status(project.getStatus())
                .members(members)
                .applicantCount(applicantCount)
                .createdAt(project.getCreatedAt())
                .build();
    }
}
