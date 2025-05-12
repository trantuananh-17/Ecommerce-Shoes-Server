export interface APIResponse<T = any> {
  status_code: number;
  message: string;
  data?: T;
  pagination?: Record<string, any>;
  error?: string;
}

export const apiResponse = <T = any>(
  status_code: number,
  message: string,
  data?: T,
  pagination?: Record<string, any>
): APIResponse<T> => {
  const response: APIResponse<T> = {
    status_code,
    message,
  };

  if (data !== undefined && data !== null) {
    response.data = data;
  }

  if (pagination !== undefined) {
    response.pagination = pagination;
  }

  return response;
};

export const apiError = (
  status_code: number,
  message: string,
  error?: any
): APIResponse => {
  return {
    status_code,
    message,
    error: error?.message || String(error) || "Unknown error",
  };
};
