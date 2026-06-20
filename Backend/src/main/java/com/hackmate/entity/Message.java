package com.hackmate.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Message {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
    
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;
    
    @Column(length = 1000, nullable = false)
    private String content;
    
    @Column(name = "timestamp")
    private java.time.LocalDateTime timestamp;
    
    @PrePersist
    protected void onCreate() {
        timestamp = java.time.LocalDateTime.now();
    }
}
