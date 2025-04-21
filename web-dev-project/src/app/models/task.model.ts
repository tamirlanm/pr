export interface Task {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  category: number;
  owner?: number;
}
