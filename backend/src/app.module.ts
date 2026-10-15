import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ModelsModule } from './models/models.module';
import { EvaluationsModule } from './evaluations/evaluations.module';

@Module({
  imports: [AuthModule, ModelsModule, EvaluationsModule],
})
export class AppModule {}
