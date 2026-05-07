import { IsNotEmpty, IsOptional, IsString  } from "class-validator"

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  techStack: string;

  @IsString()
  @IsNotEmpty()
  difficulty: string;

  @IsOptional()
  @IsString()
  githubLink?: string;
}