package com.hackmate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String bio;
    
    private String college;
    
    private String branch;
    
    private Integer year;
    
    private String experienceLevel;
    
    private String githubUrl;
    
    private String linkedinUrl;
    
    private String portfolioUrl;
    
    private Double rating;
    
    private Set<String> skills;
    private java.time.LocalDateTime createdAt;
}
