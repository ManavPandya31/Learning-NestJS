import { IsNumber } from 'class-validator';

export class CreateRequestDto {
  @IsNumber()
  projectId: number;
}