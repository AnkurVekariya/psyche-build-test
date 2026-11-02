export interface Page<T> {
  items: T[];
  page: number;
  hasMore: boolean;
}

/** Pages are numbered from 1. */
export function paginate<T>(all: T[], page: number, size: number): Page<T> {
  const start = page * size;
  const items = all.slice(start, start + size);
  return { items, page, hasMore: start + size < all.length };
}
