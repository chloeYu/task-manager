import { User } from "../../auth/models/user.model";

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
export type PRIORITY = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
    id?: number;
    title: string;
    description: string;
    user?: User;
    status: TaskStatus;
    priority: PRIORITY;
    dueDate?: string;
    createdAt?: string;
}