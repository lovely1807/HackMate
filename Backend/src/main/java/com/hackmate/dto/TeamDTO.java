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
public class TeamDTO {
    private Long id;
    private String name;
    private String description;
    private String projectName;
    private Integer maxMembers;
    private String leaderUsername;
    private Long leaderId;
    private Set<String> members;
    private Set<String> requiredSkills;
    private Boolean isOpen;
    private java.time.LocalDateTime createdAt;
}
