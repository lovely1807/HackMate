package com.hackmate.dto;

import lombok.Data;
import java.util.Set;

@Data
public class CreateProjectRequest {
    private String title;
    private String description;
    private String category;
    private String projectName;
    private Integer teamSize;
    private String hackathonName;
    private Set<String> requiredSkills;
    private Set<String> techStack;
}
