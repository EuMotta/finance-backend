import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { TransactionDto, TransactionSummaryItem } from './transaction.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TransactionCategory } from 'src/db/entities/transaction.entity';

/**
 * @class SummaryOptions
 *
 * DTO para as queries do summary.
 */
export class SummaryOptions {
  @ApiPropertyOptional({
    description: 'Data de início do intervalo (ex: 2025-01-01)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  readonly start_month?: Date;

  @ApiPropertyOptional({
    description: 'Data de fim do intervalo (ex: 2025-05-01)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  readonly end_month?: Date;
}

/**
 * @class BalanceDetailsDto
 *
 * DTO para os detalhes do summary.
 */

export class BalanceDetailsDto {
  @ApiProperty({
    description: 'Valor do item',
    type: Number,
  })
  @IsNumber()
  readonly value?: number;

  @ApiProperty({
    description: 'Percentual de mudança do valor',
    type: Number,
  })
  @IsNumber()
  readonly change_percent?: number;
}

/**
 * @class RangeDataDto
 *
 * DTO para o interfalo do summary.
 */

export class RangeDataDto {
  @ApiPropertyOptional({
    description: 'Data de início do intervalo (ex: 2025-01-01)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  start_month?: Date;

  @ApiPropertyOptional({
    description: 'Data de fim do intervalo (ex: 2025-05-01)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  end_month?: Date;

  @ApiProperty({
    description: 'Lista de transações do intervalo',
    type: [TransactionDto],
  })
  transactions: TransactionDto[];
}
export class RangeByCategoryDto {
  @ApiProperty({ description: 'Categoria da tarefa', example: 'Financeiro' })
  @IsString()
  @IsNotEmpty()
  category: TransactionCategory;

  @ApiProperty({
    description: 'Valor monetário relacionado à tarefa',
    example: 120.5,
  })
  @IsNumber()
  amount: number;
}

export class summaryDto {
  @ApiProperty({ type: TransactionSummaryItem })
  total_balance: BalanceDetailsDto;

  @ApiProperty({
    description: 'Detalhes da receita',
    type: BalanceDetailsDto,
  })
  income: BalanceDetailsDto;

  @ApiProperty({
    description: 'Detalhes das despesas',
    type: BalanceDetailsDto,
  })
  expenses: BalanceDetailsDto;

  @ApiProperty({
    description: 'Detalhes dos investimentos',
    type: BalanceDetailsDto,
  })
  investments: BalanceDetailsDto;

  @ApiProperty({
    description: 'Dados do intervalo de tempo',
    type: RangeDataDto,
  })
  range_data: RangeDataDto;

  @IsArray()
  @ApiProperty({
    description: 'Dados do intervalo de tempo',
    type: [RangeByCategoryDto],
  })
  range_by_category: RangeByCategoryDto[];
}
