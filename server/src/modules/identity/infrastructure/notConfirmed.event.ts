import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { ILoggerService } from '@/common/domain/port/logger.service';

import { NotConfirmedEvent } from '../domain/models/events.model';

@Injectable()
export class UserNotConfirmedListener {
  constructor(private readonly logger: ILoggerService) {}

  @OnEvent('user.notconfirmed', { async: true })
  async handleUserCreatedEvent(event: NotConfirmedEvent) {
    const { email, confirmationToken } = event;

    try {
      // Enviar el correo de confirmación de forma asincrónica
      this.logger.info({
        message: `Correo de confirmación enviado a ${email}`,
        obj: { token: confirmationToken },
      });
    } catch (error) {
      console.error('Error sending confirmation email:', error);
    }
  }
}
