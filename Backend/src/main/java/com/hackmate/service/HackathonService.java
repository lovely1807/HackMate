package com.hackmate.service;

import com.hackmate.dto.HackathonDTO;
import com.hackmate.entity.Hackathon;
import com.hackmate.repository.HackathonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HackathonService {
    
    private final HackathonRepository hackathonRepository;
    
    @PostConstruct
    public void init() {
        if (hackathonRepository.count() == 0) {
            hackathonRepository.saveAll(List.of(
                    Hackathon.builder()
                            .name("Smart India Hackathon 2026")
                            .date("2026-08-15")
                            .registrationLink("https://sih.gov.in")
                            .mode("Hybrid")
                            .location("India (Multiple Locations)")
                            .build(),
                    Hackathon.builder()
                            .name("HackCBS")
                            .date("2026-09-20")
                            .registrationLink("https://hackcbs.tech")
                            .mode("Offline")
                            .location("New Delhi")
                            .build(),
                    Hackathon.builder()
                            .name("Devfolio x ETHIndia")
                            .date("2026-11-05")
                            .registrationLink("https://ethindia.devfolio.co")
                            .mode("Online")
                            .location("Online (India)")
                            .build()
            ));
        }
    }
    
    public List<HackathonDTO> getAllHackathons() {
        return hackathonRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }
    
    private HackathonDTO mapToDTO(Hackathon hackathon) {
        return HackathonDTO.builder()
                .id(hackathon.getId())
                .name(hackathon.getName())
                .date(hackathon.getDate())
                .registrationLink(hackathon.getRegistrationLink())
                .mode(hackathon.getMode())
                .location(hackathon.getLocation())
                .build();
    }
}
