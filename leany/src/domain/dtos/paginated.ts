export type Paginated<T> = {
  data: T[];
  pages: number;
  items: number;
};
