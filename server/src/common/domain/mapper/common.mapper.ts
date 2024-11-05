import { Injectable } from '@nestjs/common';

import { ApiResponseDTO } from '../types/api-response.dto';

@Injectable()
export class CommonMapper {
  public mapApiResponse<T>(
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
