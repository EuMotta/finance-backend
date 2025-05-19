import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { TransactionService } from './transaction.service';
import {
  CreateTransactionDto,
  TransactionDto,
} from './dto/transaction.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TokenPayload } from 'src/interfaces/token.interface';
import { GetUser } from 'src/decorators/get-user.decorator';
import { PageOptions } from 'src/db/pagination/page-options.dto';
import { ApiResponseData } from 'src/interfaces/api';
import { Page } from 'src/db/pagination/page.dto';
import { AxiosErrorResponse } from 'src/utils/error.dto';
import { ApiResponseSummaryTransaction, ApiResponseTransactionList } from './dto/transaction-swagger-response';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { SummaryOptions } from './dto/summary.dto';

/**
 * Controlador responsável pela gestão de transaçãos no sistema.
 *
 * Este controlador define os endpoints relacionados às operações de transaçãos (Transaction),
 * incluindo criação, leitura, atualização e exclusão. O acesso aos endpoints é protegido
 * por autenticação e pode ser configurado com regras de autorização.
 *
 * Funcionalidades incluídas:
 * - Criação de transaçãos.
 * - Consulta de uma transação por ID.
 * - Listagem paginada de transaçãos.
 * - Atualização e exclusão de transaçãos.
 *
 * @module TransactionController
 */

@ApiTags('transactions')
@UseGuards(AuthGuard)
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  /**
   * Cria uma nova transação.
   *
   * Este endpoint permite a criação de uma nova transação com os dados fornecidos.
   *
   * @summary Criar Transação
   * @param {TransactionDto} transaction - Dados da nova transação.
   * @returns {Promise<void>}
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar nova transação',
    operationId: 'createTransaction',
  })
  @ApiBody({ type: CreateTransactionDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Transação criada com sucesso',
  })
  create(
    @Body() transaction: CreateTransactionDto,
    @GetUser() token: TokenPayload,
  ): Promise<ApiResponseSuccess> {
    console.log(transaction);
    return this.transactionService.create(transaction, token);
  }

  @Get('summary')
  @ApiOperation({
    summary: 'Resumo financeiro geral do mês atual',
    operationId: 'getTransactionSummary',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Resumo financeiro retornado com sucesso',
    type: ApiResponseSummaryTransaction,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: AxiosErrorResponse })
  getSummary(
    @GetUser() user: TokenPayload,
    @Query() query: SummaryOptions,
  ): Promise<ApiResponseData<any>> {
    return this.transactionService.getSummary(user, query);
  }

    /**
   * Lista todas as transaçãos com suporte a paginação e filtros.
   *
   * @summary Listar transações pendentes
   * @param {FindAllParameters} Params - Parâmetros de busca e paginação.
   * @returns {Promise<TransactionDto[]>} Lista de transaçãos.
   */
    @Get('upcoming')
    @ApiOperation({
      summary: 'Listar todas as transaçãos pendentes',
      operationId: 'getAllUpcomingTransactions',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Lista de transaçãos retornada com sucesso',
      type: ApiResponseTransactionList,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: AxiosErrorResponse })
    getUpcoming(
      @Query() query: PageOptions,
    ): Promise<ApiResponseData<Page<TransactionDto>>> {
      return this.transactionService.getUpcoming(query);
    }
  
  /**
   * Retorna os detalhes de uma transação específica pelo ID.
   *
   * @summary Buscar Transação por ID
   * @param {string} id - ID da transação.
   * @returns {Promise<TransactionDto>} Transação encontrada.
   */
  @Get('/:id')
  @ApiOperation({
    summary: 'Buscar transação por ID',
    operationId: 'getTransactionById',
  })
  @ApiParam({ name: 'id', description: 'ID da transação' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transação encontrada com sucesso',
    type: TransactionDto,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: AxiosErrorResponse })
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponseData<TransactionDto>> {
    return this.transactionService.findById(id);
  }

  /**
   * Lista todas as transaçãos com suporte a paginação e filtros.
   *
   * @summary Listar Tarefas
   * @param {FindAllParameters} Params - Parâmetros de busca e paginação.
   * @returns {Promise<TransactionDto[]>} Lista de transaçãos.
   */
  @Get()
  @ApiOperation({
    summary: 'Listar todas as transaçãos',
    operationId: 'getAllTransactions',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de transaçãos retornada com sucesso',
    type: ApiResponseTransactionList,
  })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: AxiosErrorResponse })
  findAll(
    @Query() query: PageOptions,
  ): Promise<ApiResponseData<Page<TransactionDto>>> {
    return this.transactionService.getAll(query);
  }

  /**
   * Atualiza os dados de uma transação existente.
   *
   * @summary Atualizar Transação
   * @param {TransactionDto} transaction - Dados atualizados da transação.
   * @returns {Promise<void>}
   *
  @Put()
  @ApiOperation({ summary: 'Atualizar transação', operationId: 'updateTransaction' })
  @ApiBody({ type: TransactionDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transação atualizada com sucesso',
  })
  update(@Body() transaction: TransactionDto): void {
    this.transactionService.update(transaction);
  }

  /**
   * Remove uma transação do sistema pelo ID.
   *
   * @summary Deletar Transação
   * @param {string} id - ID da transação a ser removida.
   * @returns {Promise<void>}
   *
  @Delete('/:id')
  @ApiOperation({ summary: 'Deletar transação por ID', operationId: 'deleteTransaction' })
  @ApiParam({ name: 'id', description: 'ID da transação a ser removida' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Transação removida com sucesso',
  })
  remove(@Param('id') id: string): void {
    this.transactionService.findById(id);
    this.transactionService.remove(id);
  }*/
}
