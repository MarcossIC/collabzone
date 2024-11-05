import { Module } from '@nestjs/common';
import { LoadersService } from './infrastructure/loader.service';
import { LoaderServiceAdapter } from './domain/ports/loader.service.adapter';
import { CommonModule } from '@/common/common.module';

@Module({
  imports: [CommonModule],
  providers: [
    {
      provide: LoaderServiceAdapter,
      useClass: LoadersService,
    },
  ],
  exports: [LoaderServiceAdapter],
})
export class LoadersModule {}
