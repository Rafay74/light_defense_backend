import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Rfq {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user_id: string;

  @Column()
  full_name: string;

  @Column()
  company_name: string;

  @Column()
  country: string;

  @Column()
  city: string;

  @Column({ type: 'varchar', length: 255 })
  part_number: string;

  @Column({ type: 'varchar', length: 255 })
  model_number: string;

  @Column()
  phone_number: string;

  @Column()
  description_file_path: string; //document uploaded file path

  @Column()
  manufacture_reference: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
