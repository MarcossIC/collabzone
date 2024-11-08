import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotConfirmedEvent } from '../domain/models/events.model';
import { ILoggerService } from '@/common/infrastructure/logger/logger.adapter';

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
      // Manejar el error si el envío del correo falla
      console.error('Error sending confirmation email:', error);
    }
  }
}
