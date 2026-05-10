package com.bokyungyu.taskmanager.model.dto;

import java.time.LocalDate;

import com.bokyungyu.taskmanager.model.enums.Priority;
import com.bokyungyu.taskmanager.model.enums.TaskStatus;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
public class TaskRequest {
    @NotEmpty
    private String title;
    @NotEmpty
    private String description;
    private LocalDate dueDate;
    private TaskStatus status;
    private Priority priority;
}
