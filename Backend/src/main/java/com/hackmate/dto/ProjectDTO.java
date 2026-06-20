package com.hackmate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String projectName;
    private Integer teamSize;
    private String hackathonName;
    private String githubUrl;
    private String linkedinUrl;
    private String deadline;
    private UserDTO owner;
    private Set<String> requiredSkills;
    private Set<String> techStack;
    private String status;
    private List<UserDTO> members;
    private Integer applicantCount;
    private java.time.LocalDateTime createdAt;
}
