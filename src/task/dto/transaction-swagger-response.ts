import { ApiProperty } from '@nestjs/swagger';
import { PageMeta } from 'src/db/pagination/page-meta.dto';
import { IsArray } from 'class-validator';
import { TransactionResponseDto } from './transaction.dto';
import { summaryDto } from './summary.dto';

/**
 * @class ApiResponseUserList
 *
 * DTO para receber no swagger as informações da lista de usuários.
 */

export class TransactionPage {
  @IsArray()
  @ApiProperty({ isArray: true, type: TransactionResponseDto })
  readonly data: TransactionResponseDto[];

  @ApiProperty({ type: () => PageMeta })
  readonly meta: PageMeta;

  constructor(data: TransactionResponseDto[], meta: PageMeta) {
    this.data = data;
    this.meta = meta;
  }
}

/**
 * @class ApiResponseUserList
 *
 * DTO para receber no swagger as informações da lista de usuários.
 */

export class ApiResponseTransactionList {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Usuário encontrado com sucesso!' })
  message: string;

  @ApiProperty({ type: TransactionPage })
  data: TransactionPage;
}

/**
 * @class ApiResponseTransaction
 *
 * DTO para receber no swagger as informações da transação.
 */

export class ApiResponseTransaction {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Transação encontrada com sucesso!' })
  message: string;

  @ApiProperty({ type: TransactionResponseDto })
  data: TransactionResponseDto;
}

/**
 * @class ApiResponseSummaryTransaction
 *
 * DTO para receber no swagger as informações do summary da transação.
 */

export class ApiResponseSummaryTransaction {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'sumário encontrado com sucesso!' })
  message: string;

  @ApiProperty({ type: summaryDto})
  data: summaryDto;
}
