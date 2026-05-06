package com.bokyungyu.taskmanager.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.bokyungyu.taskmanager.model.entity.Task;
import com.bokyungyu.taskmanager.repository.TaskRepository;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> getAllTasksByUserId(Long userId) {
        Sort sort = Sort.by("dueDate").ascending();
        return taskRepository.findByUserId(userId, sort);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public Task updateTask(Long id, Task task) {
        Task existing = this.taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
        existing.setTitle(task.getTitle());
        existing.setPriority(task.getPriority());
        existing.setDescription(task.getDescription());
        existing.setStatus(task.getStatus());
        existing.setDueDate(task.getDueDate());
        return taskRepository.save(existing);
    }

    public void deleteTask(Long id) {
        Task existing = getTaskById(id);
        taskRepository.delete(existing);
    }
}
