package com.bokyungyu.taskmanager.model.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import com.bokyungyu.taskmanager.model.enums.Priority;
import com.bokyungyu.taskmanager.model.enums.TaskStatus;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private TaskStatus status;
    private Priority priority;
    private LocalDateTime createdAt;
}
