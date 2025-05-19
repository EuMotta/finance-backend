import {
  BadRequestException,
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTransactionDto, TransactionDto } from './dto/transaction.dto';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import {
  TransactionEntity,
  TransactionStatus,
  TransactionType,
} from 'src/db/entities/transaction.entity';
import { Between, Repository } from 'typeorm';
import { TokenPayload } from 'src/interfaces/token.interface';
import { validate } from 'class-validator';
import { ApiResponseData } from 'src/interfaces/api';
import { PageOptions } from 'src/db/pagination/page-options.dto';
import { Page } from 'src/db/pagination/page.dto';
import { PageMeta } from 'src/db/pagination/page-meta.dto';
import { percentChange } from 'src/utils/percentage';
import { SummaryOptions } from './dto/summary.dto';
@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(TransactionEntity)
    private transactionRepository: Repository<TransactionEntity>,
  ) {}

  async create(newTransaction: CreateTransactionDto, token: TokenPayload) {
    console.log(newTransaction);
    try {
      const createTransaction = this.transactionRepository.create({
        ...newTransaction,
        user: { id: token.sub },
      });

      const errors = await validate(createTransaction);
      if (errors.length > 0) {
        const messages = errors
          .map((e) => Object.values(e.constraints || {}))
          .flat();
        throw new BadRequestException(messages);
      }

      await this.transactionRepository.save(createTransaction);

      return {
        message: 'Transação criado com sucesso!',
        error: false,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erro ao criar Transação:', error);
      throw new InternalServerErrorException('Erro ao criar Transação');
    }
  }

  async findById(id: string): Promise<ApiResponseData<TransactionDto>> {
    const foundTransaction = await this.transactionRepository.findOne({
      where: { id: id },
    });

    if (!foundTransaction) {
      throw new NotFoundException('Transação não encontrado');
    }

    return {
      message: 'Transação encontrada com sucesso!',
      error: false,
      data: foundTransaction,
    };
  }

  async getAll(
    pageOptions: PageOptions,
  ): Promise<ApiResponseData<Page<TransactionDto>>> {
    try {
      const { page, limit, search, status, order, orderBy, type } = pageOptions;
      const offset = (page - 1) * limit;
      console.log('type', type);
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transaction')
        .select([
          'transaction.id',
          'transaction.title',
          'transaction.subtitle',
          'transaction.category',
          'transaction.date',
          'transaction.amount',
          'transaction.status',
          'transaction.type',
          'transaction.created_at',
        ])
        .limit(limit)
        .offset(offset);

      if (search) {
        queryBuilder.andWhere(
          '(transaction.title ILIKE :search OR transaction.subtitle ILIKE :search OR CAST(transaction.amount AS TEXT) ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (
        type &&
        Object.values(TransactionType).includes(type as TransactionType)
      ) {
        queryBuilder.andWhere('transaction.type = :type', { type });
      }

      if (
        status &&
        Object.values(TransactionStatus).includes(status as TransactionStatus)
      ) {
        queryBuilder.andWhere('transaction.status = :status', { status });
      }
      if (orderBy) {
        const validColumns = [
          'title',
          'subtitle',
          'amount',
          'type',
          'category',
          'date',
          'created_at',
        ];
        if (!validColumns.includes(orderBy)) {
          throw new BadRequestException(
            `Campo de ordenação inválido: ${orderBy}`,
          );
        }
        queryBuilder.orderBy(`transaction.${orderBy}`, order || 'ASC');
      } else {
        queryBuilder.orderBy('transaction.created_at', order || 'ASC');
      }

      const itemCount = await queryBuilder.getCount();
      const data = await queryBuilder.getMany();

      const pageMetaDto = new PageMeta({ itemCount, pageOptions });
      const pageDto = new Page(data, pageMetaDto);

      return {
        error: false,
        message: 'Transações encontrados com sucesso!',
        data: pageDto,
      };
    } catch (error) {
      console.error('Erro ao buscar Transações:', error);
      throw new InternalServerErrorException('Erro ao buscar Transações');
    }
  }

  async getUpcoming(
    pageOptions: PageOptions,
  ): Promise<ApiResponseData<Page<TransactionDto>>> {
    try {
      const { page, limit, search, status, order, orderBy, type } = pageOptions;
      const offset = (page - 1) * limit;
      
      const queryBuilder = this.transactionRepository
        .createQueryBuilder('transaction')
        .select([
          'transaction.id',
          'transaction.title',
          'transaction.subtitle',
          'transaction.category',
          'transaction.date',
          'transaction.amount',
          'transaction.status',
          'transaction.type',
          'transaction.created_at',
        ])
        .limit(limit)
        .offset(offset);
        queryBuilder.andWhere('transaction.date > NOW()');

      if (search) {
        queryBuilder.andWhere(
          '(transaction.title ILIKE :search OR transaction.subtitle ILIKE :search OR CAST(transaction.amount AS TEXT) ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (
        type &&
        Object.values(TransactionType).includes(type as TransactionType)
      ) {
        queryBuilder.andWhere('transaction.type = :type', { type });
      }

      if (
        status &&
        Object.values(TransactionStatus).includes(status as TransactionStatus)
      ) {
        queryBuilder.andWhere('transaction.status = :status', { status });
      }
      if (orderBy) {
        const validColumns = [
          'title',
          'subtitle',
          'amount',
          'type',
          'category',
          'date',
          'created_at',
        ];
        if (!validColumns.includes(orderBy)) {
          throw new BadRequestException(
            `Campo de ordenação inválido: ${orderBy}`,
          );
        }
        queryBuilder.orderBy(`transaction.${orderBy}`, order || 'ASC');
      } else {
        queryBuilder.orderBy('transaction.created_at', order || 'ASC');
      }

      const itemCount = await queryBuilder.getCount();
      const data = await queryBuilder.getMany();

      const pageMetaDto = new PageMeta({ itemCount, pageOptions });
      const pageDto = new Page(data, pageMetaDto);

      return {
        error: false,
        message: 'Transações pendentes encontrados com sucesso!',
        data: pageDto,
      };
    } catch (error) {
      console.error('Erro ao buscar Transações:', error);
      throw new InternalServerErrorException('Erro ao buscar Transações');
    }
  }
  async getSummary(user: TokenPayload, query: SummaryOptions): Promise<any> {
    try {
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth();

      const defaultStart = new Date(currentYear, currentMonth - 1, 1);
      const defaultEnd = new Date(currentYear, currentMonth + 1, 0);

      const startDate = query.start_month ?? defaultStart;
      const endDate = query.end_month ?? defaultEnd;

      const lastYearStartDate = new Date(
        startDate.getFullYear() - 1,
        startDate.getMonth(),
        1,
      );
      const lastYearEndDate = new Date(
        endDate.getFullYear() - 1,
        endDate.getMonth() + 1,
        0,
      );

      const [currentTransactions, previousTransactions] = await Promise.all([
        this.transactionRepository.find({
          where: {
            user: { id: user.sub },
            date: Between(startDate, endDate),
          },
          order: { date: 'ASC' },
        }),
        this.transactionRepository.find({
          where: {
            user: { id: user.sub },
            date: Between(lastYearStartDate, lastYearEndDate),
          },
          order: { date: 'ASC' },
        }),
      ]);

      const sumBy = (list, filter) =>
        list.filter(filter).reduce((sum, tx) => sum + Number(tx.amount), 0);

      const currentIncome = sumBy(
        currentTransactions,
        (t) => t.type === 'Income',
      );
      const currentExpenses = sumBy(
        currentTransactions,
        (t) => t.type === 'Expense',
      );
      const currentInvestments = sumBy(
        currentTransactions,
        (t) => t.category === 'INVESTMENTS',
      );

      const lastIncome = sumBy(
        previousTransactions,
        (t) => t.type === 'Income',
      );
      const lastExpenses = sumBy(
        previousTransactions,
        (t) => t.type === 'Expense',
      );
      const lastInvestments = sumBy(
        previousTransactions,
        (t) => t.category === 'INVESTMENTS',
      );

      const rangeByCategory = currentTransactions.reduce((acc, tx) => {
        const category = tx.category;
        const amount = Number(tx.amount);

        if (!acc[category]) {
          acc[category] = 0;
        }

        acc[category] += amount;
        return acc;
      }, {});

      const rangeByCategoryResult = Object.entries(rangeByCategory).map(
        ([category, value]) => ({
          category,
          value,
        }),
      );

      const currentBalance = currentIncome - currentExpenses;
      const lastBalance = lastIncome - lastExpenses;

      return {
        error: false,
        message: 'Resumo financeiro gerado com sucesso',
        data: {
          total_balance: {
            value: currentBalance,
            change_percent: percentChange(currentBalance, lastBalance),
          },
          income: {
            value: currentIncome,
            change_percent: percentChange(currentIncome, lastIncome),
          },
          expenses: {
            value: currentExpenses,
            change_percent: percentChange(currentExpenses, lastExpenses),
          },
          investments: {
            value: currentInvestments,
            change_percent: percentChange(currentInvestments, lastInvestments),
          },
          range_data: {
            start_month: query.start_month ?? defaultStart,
            end_month: query.end_month ?? defaultEnd,
            transactions: currentTransactions,
          },
          range_by_category: rangeByCategoryResult,
        },
      };
    } catch (error) {
      console.error('Erro ao buscar o sumário:', error);
      throw new InternalServerErrorException('Erro ao buscar o sumário');
    }
  }

  /* 
  update(transaction: TransactionDto) {
    const transactionIndex = this.transactions.findIndex((t) => t.id === transaction.id);

    if (transactionIndex >= 0) {
      this.transactions[transactionIndex] = transaction;
      return;
    }

    throw new HttpException(
      `transaction com id: ${transaction.id} nao encontrada`,
      HttpStatus.BAD_REQUEST,
    );
  }

  remove(id: string) {
    const transactionIndex = this.transactions.findIndex((t) => t.id === id);
    if (transactionIndex >= 0) {
      this.transactions.splice(transactionIndex, 1);
      return;
    }

    throw new HttpException(
      `transaction com id ${id} nao encontrado`,
      HttpStatus.BAD_REQUEST,
    );
  } */
}
