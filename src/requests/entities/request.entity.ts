import { Entity,PrimaryGeneratedColumn,Column,ManyToOne,CreateDateColumn} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    default: 'pending',
  })
  status: string;

  @ManyToOne(() => User)
  sender: User;

  @ManyToOne(() => Project)
  project: Project;

  @CreateDateColumn()
  createdAt: Date;
}
