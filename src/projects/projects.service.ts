import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  create(data: Partial<Project>) {
    const project = this.projectRepo.create(data);

    return this.projectRepo.save(project);
  }

  findAll() {
    return this.projectRepo.find({
      relations: ['createdBy'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!project) {
      throw new NotFoundException('This User Has Not Uploaded Any Projects...');
    }

    return project;
  }

  async update(id: number, dto: any, userId: number) {
    const project = await this.projectRepo.findOne({
      where: { id },
      relations: ['createdBy'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // Ownership check
    if (project.createdBy.id !== userId) {
      throw new ForbiddenException('You can only update your own project');
    }

    Object.assign(project, dto);

    return this.projectRepo.save(project);
  }

  async remove(id: number, userId: number) {
  const project = await this.projectRepo.findOne({
    where: { id },
    relations: ['createdBy'],
  });

  if (!project) {
    throw new NotFoundException('Project not found');
  }

  // ownership check
  if (project.createdBy.id !== userId) {
    throw new ForbiddenException(
      'You can only delete your own project',
    );
  }

  await this.projectRepo.remove(project);

  return {
    message: 'Project deleted successfully',
  };
}
}
