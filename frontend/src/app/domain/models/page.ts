export interface Page<T> {
  items: T[];
  total: number;
}

export interface PageRequest {
  page: number;
  pageSize: number;
}

export type SortDirection = 'asc' | 'desc';

export interface Sort<TField extends string> {
  field: TField;
  direction: SortDirection;
}
