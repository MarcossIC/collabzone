import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller()
export class AppController {
  private readonly port: number;

  constructor(private readonly configService: ConfigService) {
    this.port = this.configService.get<number>('server.port');
  }

  @Get()
  public getInitialRoute(): string {
    return `Server running on ${this.port}`;
  }
}
