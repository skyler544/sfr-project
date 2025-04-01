export type SortColumn =
  | 'id'
  | 'continent'
  | 'latitude'
  | 'longitude'
  | 'depth'
  | 'energy';
export type SortDirection = 'asc' | 'desc';

export interface SortCriteria {
  column: SortColumn;
  direction: SortDirection;
}
