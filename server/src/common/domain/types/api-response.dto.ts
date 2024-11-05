export interface ApiResponseDTO<T> {
  statusCode: number;
  message: string;
  data?: T;
}
