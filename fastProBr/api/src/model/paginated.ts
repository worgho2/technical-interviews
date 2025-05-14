export type Paginated<T> = {
    count: number;
    data: T[];
    offset: number | null;
};
