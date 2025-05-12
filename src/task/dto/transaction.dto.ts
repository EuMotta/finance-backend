import { ApiProperty, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsUUID,
  IsString,
  IsOptional,
  IsDateString,
  IsNumber,
  IsEnum,
  IsNotEmpty,
  Length,
  IsDate,
  IsISO8601,
} from 'class-validator';
import {
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from 'src/db/entities/transaction.entity';
import { UserEntity } from 'src/db/entities/user.entity';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Pagamento de conta',
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  title: string;

  @ApiProperty({
    description: 'Subtítulo ou descrição adicional da tarefa',
    required: false,
  })
  @IsString()
  @IsOptional()
  @Length(0, 150)
  subtitle?: string;

  @ApiProperty({ description: 'Categoria da tarefa', example: 'Financeiro' })
  @IsString()
  @IsNotEmpty()
  category: TransactionCategory;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Data da transação em formato ISO 8601',
    example: '2025-05-08T09:00:00Z',
    required: false,
  })
  @IsISO8601()
  date?: Date;

  @ApiProperty({
    description: 'Valor monetário relacionado à tarefa',
    example: 120.5,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Status da tarefa', enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ApiProperty({ description: 'Tipo da tarefa', enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;
}

export class TransactionResponseDto extends CreateTransactionDto {
  id: string;
  user: UserEntity;
}

export class TransactionDto {
  @ApiProperty({ description: 'ID único da tarefa', required: false })
  @IsUUID()
  @IsOptional()
  id?: string;

  @ApiProperty({
    description: 'Título da tarefa',
    example: 'Pagamento de conta',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Subtítulo ou descrição adicional da tarefa',
    required: false,
  })
  @IsString()
  @IsOptional()
  subtitle?: string;

  @ApiProperty({ description: 'Categoria da tarefa', example: 'Financeiro' })
  @IsString()
  @IsNotEmpty()
  category: TransactionCategory;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Data da transação em formato ISO 8601',
    example: '2025-05-08T09:00:00Z',
    required: false,
  })
  @IsISO8601()
  date?: Date;

  @ApiProperty({
    description: 'Valor monetário relacionado à tarefa',
    example: 120.5,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({ description: 'Status da tarefa', enum: TransactionStatus })
  @IsEnum(TransactionStatus)
  status: TransactionStatus;

  @ApiProperty({ description: 'Tipo da tarefa', enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;
}

export class TransactionSummaryItem {
  @ApiProperty({ example: 24582.35 })
  value: number;

  @ApiProperty({ example: 8.4 })
  changePercent: number;
}

export class TransactionSummaryResponse {
  @ApiProperty({ type: TransactionSummaryItem })
  totalBalance: TransactionSummaryItem;

  @ApiProperty({ type: TransactionSummaryItem })
  income: TransactionSummaryItem;

  @ApiProperty({ type: TransactionSummaryItem })
  expenses: TransactionSummaryItem;

  @ApiProperty({ type: TransactionSummaryItem })
  investments: TransactionSummaryItem;
}

export class ApiResponseTransactionSummary {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Resumo financeiro gerado com sucesso' })
  message: string;

  @ApiProperty({ type: TransactionSummaryResponse })
  data: TransactionSummaryResponse;
}
