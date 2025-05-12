import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import {
  IsDate,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';
import { UserEntity } from './user.entity';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';

export enum TransactionStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  FAILED = 'Failed',
}

export enum TransactionType {
  INCOME = 'Income',
  EXPENSE = 'Expense',
  TRANSFER = 'Transfer',
}
export enum TransactionCategory {
  SALARY = 'SALARY',
  FREELANCE = 'FREELANCE',
  INVESTMENT = 'INVESTMENT',
  GIFT = 'GIFT',
  FOOD = 'FOOD',
  GROCERIES = 'GROCERIES',
  TRANSPORT = 'TRANSPORT',
  TRAVEL = 'TRAVEL',
  HEALTH = 'HEALTH',
  INSURANCE = 'INSURANCE',
  EDUCATION = 'EDUCATION',
  ENTERTAINMENT = 'ENTERTAINMENT',
  UTILITIES = 'UTILITIES',
  SUBSCRIPTIONS = 'SUBSCRIPTIONS',
  SHOPPING = 'SHOPPING',
  TAXES = 'TAXES',
  RENT = 'RENT',
  LOAN = 'LOAN',
  CHARITY = 'CHARITY',
  OTHER = 'OTHER',
}

@Entity({ name: 'transactions' })
export class TransactionEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.transactions, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({ name: 'user_id' })
  @ApiProperty({
    example: 'a3e1f9c7-d2a1-41f0-9f9e-b86cb78a6ec3',
    description: 'ID do usuário associado à tarefa',
  })
  user: UserEntity;

  @Column({ type: 'varchar' })
  @IsNotEmpty({ message: 'O título é obrigatório.' })
  @IsString()
  @Length(2, 100)
  title: string;

  @Column({ type: 'varchar', nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 150)
  subtitle?: string;

  @Column({ type: 'varchar' })
  @IsEnum(TransactionCategory)
  @IsNotEmpty({ message: 'A categoria é obrigatória.' })
  @IsString()
  category: TransactionCategory;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @IsNotEmpty({ message: 'A data da transação é obrigatória.' })
  date: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @Column({ type: 'enum', enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @Column({ type: 'enum', enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;
}
