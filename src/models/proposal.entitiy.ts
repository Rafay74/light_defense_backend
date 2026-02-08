import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import type { ProposalContent } from '@types';

@Entity()
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    unique: true,
  })
  @Index({ unique: true })
  number: string;

  @Column({ unique: true })
  @Index()
  user_id: string;

  @Column({
    type: 'date',
    nullable: true,
  })
  @Index()
  due_date: Date;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  content: ProposalContent;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, { eager: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
