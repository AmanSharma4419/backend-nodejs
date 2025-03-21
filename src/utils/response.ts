interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export const successResponse = <T>(data: T): ApiResponse<T> => ({
  success: true,
  data,
  timestamp: new Date().toISOString(),
});

export const errorResponse = (message: string): ApiResponse<null> => ({
  success: false,
  error: message,
  timestamp: new Date().toISOString(),
}); 