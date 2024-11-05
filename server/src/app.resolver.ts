import { ConfigService } from '@nestjs/config';
import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  private readonly port: number;

  constructor(private readonly configService: ConfigService) {
    this.port = this.configService.get<number>('server.port');
  }

  @Query(() => String)
  sayHello(): string {
    return `Server running on ${this.port}`;
  }
}
