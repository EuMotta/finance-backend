import { Type } from 'class-transformer';
import { IsDate, IsNumber, IsOptional } from 'class-validator';
import { TransactionDto, TransactionSummaryItem } from './transaction.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
  readonly startMonth?: Date;

  @ApiPropertyOptional({
    description: 'Data de fim do intervalo (ex: 2025-05-01)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  readonly endMonth?: Date;
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
  readonly changePercent?: number;
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
  startMonth?: Date;

  @ApiPropertyOptional({
    description: 'Data de fim do intervalo (ex: 2025-05-01)',
    type: String,
    format: 'date',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endMonth?: Date;

  @ApiProperty({
    description: 'Lista de transações do intervalo',
    type: [TransactionDto],
  })
  transactions: TransactionDto[];
}

export class summaryDto {
  @ApiProperty({ type: TransactionSummaryItem })
  totalBalance: BalanceDetailsDto;

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
  rangeData: RangeDataDto;
}
