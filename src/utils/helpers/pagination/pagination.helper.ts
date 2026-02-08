import { PaginationDto } from '../../dto/pagination.dto';
import { PaginationSortEnum } from '../../enums';

export interface PaginationResult<T> {
  records: T[];
  pagination: {
    limit: number;
    offset: number;
    total: number;
    has_more: boolean;
  };
}

export interface PaginationParams {
  limit: number;
  offset: number;
  sort_by?: PaginationSortEnum;
}

export function processPagination<T>(
  paginationDto: PaginationDto,
  data: Record<string, unknown>
): PaginationResult<T> {
  const { limit, offset } = paginationDto;
  return {
    records: Array.isArray(data?.records) ? data.records : [],
    pagination: {
      limit,
      offset,
      total: (data?._totalSize as number) || 0,
      has_more: (data?._hasMore as boolean) || false,
    },
  };
}

export function createPaginationParams(
  paginationDto: PaginationDto
): PaginationParams {
  return {
    limit: paginationDto.limit,
    offset: paginationDto.offset,
    sort_by: paginationDto.sort_by,
  };
}
