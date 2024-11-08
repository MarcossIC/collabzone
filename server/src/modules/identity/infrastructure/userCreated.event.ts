import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from '../domain/models/events.model';
import { ILoggerService } from '@/common/infrastructure/logger/logger.adapter';
import { ApiException } from '@/common/domain/types/exception';

@Injectable()
export class UserCreatedListener {
  constructor(private readonly logger: ILoggerService) {}

  @OnEvent('user.created', { async: true })
  async handleUserCreatedEvent(event: UserCreatedEvent) {
    const { email, confirmationToken } = event;

    try {
      this.logger.info({
        message: `Correo de confirmación enviado a ${email}`,
        obj: { token: confirmationToken },
      });
    } catch (error) {
      this.logger.error(
        new ApiException(error as object, 500),
        'Error sending confirmation email:',
        'UserCreatedListener',
      );
    }
  }
}
