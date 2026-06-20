package com.hackmate.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "hackathons")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hackathon {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    private String date;
    
    private String registrationLink;
    
    private String mode;
    
    private String location;
}
