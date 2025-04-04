export type SortColumn =
  | 'id'
  | 'sensor'
  | 'latitude'
  | 'longitude'
  | 'depth'
  | 'energy';
export type SortDirection = 'asc' | 'desc';

export interface SortCriteria {
  column: SortColumn;
  direction: SortDirection;
}
