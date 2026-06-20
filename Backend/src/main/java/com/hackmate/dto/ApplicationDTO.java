package com.hackmate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {
    private Long id;
    private ProjectDTO project;
    private UserDTO user;
    private String message;
    private String status;
    private java.time.LocalDateTime createdAt;
}
