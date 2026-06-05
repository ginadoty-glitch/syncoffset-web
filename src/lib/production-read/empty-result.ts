export type ProductionReadResult<T> = {
  showId: string | null;
  rows: T[];
  loadError: string | null;
};

export function emptyReadResult<T>(loadError: string | null): ProductionReadResult<T> {
  return { showId: null, rows: [], loadError };
}
