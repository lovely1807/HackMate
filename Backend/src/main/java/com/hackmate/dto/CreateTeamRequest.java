package com.hackmate.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.util.Set;

@Data
public class CreateTeamRequest {
    
    @NotBlank(message = "Team name is required")
    private String name;
    
    private String description;
    
    private String projectName;
    
    private Integer maxMembers;
    
    private Set<String> requiredSkills;
    
    private Boolean isOpen;
}
