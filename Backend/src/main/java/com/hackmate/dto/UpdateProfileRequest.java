package com.hackmate.dto;

import lombok.Data;
import java.util.Set;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String bio;
    private String college;
    private String branch;
    private Integer year;
    private String experienceLevel;
    private String githubUrl;
    private String linkedinUrl;
    private String portfolioUrl;
    private Set<String> skills;
}
