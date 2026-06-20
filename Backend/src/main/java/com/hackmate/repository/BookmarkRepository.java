package com.hackmate.repository;

import com.hackmate.entity.Bookmark;
import com.hackmate.entity.Project;
import com.hackmate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    List<Bookmark> findByUser(User user);
    Optional<Bookmark> findByUserAndProject(User user, Project project);
    boolean existsByUserAndProject(User user, Project project);
}
