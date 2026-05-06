package com.bokyungyu.taskmanager.repository;

import com.bokyungyu.taskmanager.model.entity.Task;
import com.bokyungyu.taskmanager.model.enums.TaskStatus;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId, Sort sort);

    List<Task> findByUserIdOrderByCreatedAtDesc(Long userId, Sort sort);

    List<Task> findByStatus(TaskStatus status, Sort sort);

    List<Task> findByUserIdAndStatus(Long userId, TaskStatus status, Sort sort);
}
