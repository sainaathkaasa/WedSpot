export interface TaskDTO {
    id: number;
    text: string;
    priority: string;
    dueDate: string;
    completed: boolean;
    category: string;
    points: number;
    assignedTo?: {
        id: number;
        name: string;
    };
    createdAt: string;
    updatedAt: string;
}
