import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id : number;

    @Column({ unique:true })
    email :  string;

    @Column()
    password : string;

    @CreateDateColumn()
    createdAt : Date;

@OneToMany(() => Project, (project) => project.createdBy)
projects: Project[];
}