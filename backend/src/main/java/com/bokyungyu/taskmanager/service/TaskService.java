package com.bokyungyu.taskmanager.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.bokyungyu.taskmanager.model.dto.TaskResponse;
import com.bokyungyu.taskmanager.model.dto.TaskRequest;
import com.bokyungyu.taskmanager.model.entity.Task;
import com.bokyungyu.taskmanager.model.entity.User;
import com.bokyungyu.taskmanager.repository.TaskRepository;
import com.bokyungyu.taskmanager.repository.UserRepository;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private UserRepository userRepository;

    public List<Task> getAllTasks() {
        User user = extractUser();
        Sort sort = Sort.by("dueDate").ascending();
        return taskRepository.findByUserId(user.getId(), sort);
    }

    public TaskResponse getTaskById(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        User user = extractUser();
        if (task.getUser() != user) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid User");
        }
        return new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getDueDate(),
                task.getStatus(), task.getPriority(), task.getCreatedAt());
    }

    public TaskResponse createTask(TaskRequest task, HttpServletRequest request) {
        User user = extractUser();
        Task newTask = new Task();
        newTask.setTitle(task.getTitle());
        newTask.setDescription(task.getDescription());
        newTask.setDueDate(task.getDueDate());
        newTask.setPriority(task.getPriority());
        newTask.setStatus(task.getStatus());
        newTask.setUser(user);
        taskRepository.save(newTask);
        return new TaskResponse(newTask.getId(), newTask.getTitle(), newTask.getDescription(), newTask.getDueDate(),
                newTask.getStatus(), newTask.getPriority(), newTask.getCreatedAt());
    }

    public TaskResponse updateTask(Long id, TaskRequest task, HttpServletRequest request) {
        Task existing = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        User user = extractUser();
        if (existing.getUser() != user) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid User");
        }
        existing.setTitle(task.getTitle());
        existing.setPriority(task.getPriority());
        existing.setDescription(task.getDescription());
        existing.setStatus(task.getStatus());
        existing.setDueDate(task.getDueDate());
        existing.setUser(user);
        taskRepository.save(existing);
        return new TaskResponse(existing.getId(), existing.getTitle(), existing.getDescription(), existing.getDueDate(),
                existing.getStatus(), existing.getPriority(), existing.getCreatedAt());

    }

    public void deleteTask(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        User user = extractUser();
        if (task.getUser() != user) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid User");
        }
        taskRepository.deleteById(id);
    }

    public User extractUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (!(auth.getPrincipal() instanceof Long)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Invalid User");
        }
        Long userId = (Long) auth.getPrincipal();
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        return user;
    }
}
