import { Controller, Get, Param } from '@nestjs/common';
import { ModelsService, ModelEntity } from './models.service';

@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  getAll(): ModelEntity[] {
    return this.modelsService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string): ModelEntity {
    return this.modelsService.findById(id);
  }
}
