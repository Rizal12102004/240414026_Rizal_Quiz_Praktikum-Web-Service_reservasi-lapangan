import { Controller, Get, Param, Query } from '@nestjs/common';
import { FieldsService } from './fields.service';

@Controller('fields')
export class FieldsController {

  constructor(private readonly fieldsService: FieldsService) {}

  // GET /fields
  @Get()
  getAllFields() {
    return this.fieldsService.getAllFields();
  }

  // GET /fields/:id
  @Get(':id')
  getFieldById(@Param('id') id: string) {
    return this.fieldsService.getFieldById(Number(id));
  }

  // GET /fields/:id/availability?date=YYYY-MM-DD
  @Get(':id/availability')
  getAvailability(
    @Param('id') id: string,
    @Query('date') date: string,
  ) {
    return this.fieldsService.getAvailability(Number(id), date);
  }
}