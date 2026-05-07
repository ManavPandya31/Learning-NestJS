import {Controller,Post,Body,UseGuards,Get,Param,} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Any } from 'typeorm';

@Controller('projects')
export class ProjectsController {

  constructor(private projectsService: ProjectsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() dto: CreateProjectDto,
    @CurrentUser() user: any,
  ) {
    return this.projectsService.create({
      ...dto,
     createdBy: { id: user.userId } as any,
    });
  }

  @Get()
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(Number(id));
  }
}