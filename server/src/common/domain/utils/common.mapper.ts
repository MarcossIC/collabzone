import { ApiResponseDTO } from '../types/api-response.dto';

export class CommonMapper {
  public static mapApiResponse<T>(
    statusCode: number,
    message: string,
    data: T,
  ): ApiResponseDTO<T> {
    return {
      statusCode: statusCode,
      message: message,
      data: data,
    };
  }
}
