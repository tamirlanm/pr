export interface Task {
    id?: number;
    title: string;
    description: string;
    completed: boolean;
    owner: number;
    category: number | null;
    created_at?: string;
  }