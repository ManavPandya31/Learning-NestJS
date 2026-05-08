import { Controller,Post,Body,UseGuards,Get,Param,Patch } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('requests')
export class RequestsController {
  constructor(
    private requestsService: RequestsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateRequestDto,
    @CurrentUser() user: any,
  ) {
    return this.requestsService.create(
      dto.projectId,
      user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('project/:projectId')
  getProjectRequests(
    @Param('projectId') projectId: string,
    @CurrentUser() user: any,
  ) {
    return this.requestsService.findProjectRequests(
      Number(projectId),
      user.userId,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
    @CurrentUser() user: any,
  ) {
    return this.requestsService.updateStatus(
      Number(id),
      body.status,
      user.userId,
    );
  }
}