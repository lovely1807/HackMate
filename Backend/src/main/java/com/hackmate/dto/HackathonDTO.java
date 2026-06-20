package com.hackmate.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HackathonDTO {
    private Long id;
    private String name;
    private String date;
    private String registrationLink;
    private String mode;
    private String location;
}
