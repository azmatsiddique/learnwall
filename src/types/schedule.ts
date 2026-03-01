export type Difficulty = 'easy' | 'medium' | 'hard';

export interface ScheduleRow {
  id: string;
  date: Date | null;
  dateStr: string;
  task: string;
  subtask: string;
  difficulty: Difficulty;
  category: string;
  completed: boolean;
}

export interface ColumnMap {
  date: number;
  task: number;
  subtask: number;
  difficulty: number;
  category: number;
}

export interface ParseError {
  row: number;
  column: string;
  message: string;
}

export interface ParseResult {
  rows: ScheduleRow[];
  errors: ParseError[];
  totalRows: number;
}
