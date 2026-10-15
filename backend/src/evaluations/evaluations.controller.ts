import { Controller, Post, Get, Body } from '@nestjs/common';
import {
  EvaluationsService,
  EvaluationSubmissionDto,
  EloUpdateResult,
} from './evaluations.service';

@Controller('evaluations')
export class EvaluationsController {
  constructor(private readonly evaluationsService: EvaluationsService) {}

  @Post('submit')
  submit(@Body() dto: EvaluationSubmissionDto): EloUpdateResult {
    return this.evaluationsService.submitEvaluation(dto);
  }

  @Get('metrics')
  getMetrics() {
    return this.evaluationsService.getMetricsSummary();
  }
}
