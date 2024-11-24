// src/types/dashboard.ts

export type ScoreArray = [number, number];

export interface UnitScore {
  Responses: number;
  Invited: number;
  Season: string;
  'Response Rate': number;
  unit_name: string;
  code: string;
  unit_code: string;
  Level: number;
  I1: ScoreArray;
  I2: ScoreArray;
  I3: ScoreArray;
  I4: ScoreArray;
  I5: ScoreArray;
  I6: ScoreArray;
  I7: ScoreArray;
  I8: ScoreArray;
  I9: ScoreArray;
  I10: ScoreArray;
  I11: ScoreArray;
  I12: ScoreArray;
  I13: ScoreArray;
  agg_score: ScoreArray;
}

export type FilterValue = string | number | null;

export interface Filters {
  [key: string]: FilterValue;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: keyof UnitScore | null;
  direction: SortDirection;
}

export type AggregationType = 'mean' | 'median';

export interface ScoreCellProps {
  value: number;
  max?: number;
}

export interface FilterInputProps {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  type?: 'text' | 'number';
  placeholder?: string;
}