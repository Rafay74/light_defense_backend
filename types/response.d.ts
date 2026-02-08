interface BaseResponse {
  message?: string;
}

export interface ErrorResponse extends BaseResponse {
  status_code: number;
  timestamp: string;
  path: string;
  data?: unknown;
  errors?: Record<string, string[]>;
}

interface SuccessResponse<T> extends BaseResponse {
  data: T;
}

export type ResponseData<T> = Promise<SuccessResponse<T>>;
