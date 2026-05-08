import { Injectable,BadRequestException,NotFoundException,ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class RequestsService {
  constructor(
    @InjectRepository(Request)
    private requestRepo: Repository<Request>,

    @InjectRepository(Project)
    private projectRepo: Repository<Project>,
  ) {}

  async create(projectId: number, userId: number) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['createdBy'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // prevent self request
    if (project.createdBy.id === userId) {
      throw new BadRequestException(
        'You cannot request your own project',
      );
    }

    // prevent duplicate request
    const existingRequest =
      await this.requestRepo.findOne({
        where: {
          sender: { id: userId },
          project: { id: projectId },
        },
        relations: ['sender', 'project'],
      });

    if (existingRequest) {
      throw new BadRequestException(
        'Request already sent',
      );
    }

    const request = this.requestRepo.create({
      sender: {
        id: userId,
      },
      project: {
        id: projectId,
      },
    });

    return this.requestRepo.save(request);
  }

  async findProjectRequests(
    projectId: number,
    userId: number,
  ) {
    const project = await this.projectRepo.findOne({
      where: { id: projectId },
      relations: ['createdBy'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    // only owner can view
    if (project.createdBy.id !== userId) {
      throw new ForbiddenException(
        'You can only view your project requests',
      );
    }

    return this.requestRepo.find({
      where: {
        project: { id: projectId },
      },
      relations: ['sender'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateStatus(
    requestId: number,
    status: string,
    userId: number,
  ) {
    const request = await this.requestRepo.findOne({
      where: { id: requestId },
      relations: [
        'project',
        'project.createdBy',
      ],
    });

    if (!request) {
      throw new NotFoundException('Request not found');
    }

    // only project owner
    if (
      request.project.createdBy.id !== userId
    ) {
      throw new ForbiddenException(
        'Not allowed',
      );
    }

    request.status = status;

    return this.requestRepo.save(request);
  }
}