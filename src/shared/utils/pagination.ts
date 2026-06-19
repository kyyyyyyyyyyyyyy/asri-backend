export type PaginationParams = {
  page?: number;
  limit?: number;
};

export function getPagination(params: PaginationParams) {
  const page = Math.max(Number(params.page ?? 1), 1);
  const limit = Math.min(Math.max(Number(params.limit ?? 10), 1), 100);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}
