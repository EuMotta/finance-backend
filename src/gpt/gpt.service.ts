import {
  Injectable,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGptDto } from './dto/create-gpt.dto';
import { validate } from 'class-validator';
import { ApiResponseData } from 'src/interfaces/api';
import { createApiResponse } from 'src/db/db-response';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { TokenPayload } from 'src/interfaces/token.interface';
import { PageMeta } from 'src/db/pagination/page-meta.dto';
import { Page } from 'src/db/pagination/page.dto';
import { PageOptions } from 'src/db/pagination/page-options.dto';
import { GptResponseDto } from './dto/gpt.dto';
import { GptEntity } from 'src/db/entities/gpt.entity';

@Injectable()
export class GptService {
  constructor(
    @InjectRepository(GptEntity)
    private gptRepository: Repository<GptEntity>,
  ) {}

  /**
   * Cria um novo GPT personalizado.
   *
   * @param {CreateGptDto} newGpt Dados do novo GPT.
   * @returns {Promise<ApiResponseSuccess>} Confirmação da criação.
   */
  async create(
    newGpt: CreateGptDto,
    token: TokenPayload,
  ): Promise<ApiResponseSuccess> {
    try {
      const existing = await this.gptRepository.findOne({
        where: { name: newGpt.name, user: { id: token.sub } },
      });

      if (existing) {
        throw new ConflictException('Você já possui um GPT com esse nome.');
      }

      const gptEntity = this.gptRepository.create({
        ...newGpt,
        user: { id: token.sub },
      });

      const errors = await validate(gptEntity);
      if (errors.length > 0) {
        const messages = errors
          .map((e) => Object.values(e.constraints || {}))
          .flat();
        throw new BadRequestException(messages);
      }

      await this.gptRepository.save(gptEntity);

      return {
        message: 'GPT criado com sucesso!',
        error: false,
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      console.error('Erro ao criar GPT:', error);
      throw new InternalServerErrorException('Erro ao criar GPT');
    }
  }

  /**
   * Retorna todos os GPTs de um usuário.
   *
   * @param {string} userId ID do usuário.
   * @returns {Promise<ApiResponseData<GptEntity[]>>} Lista de GPTs.
   */
  async getAll(
    pageOptions: PageOptions,
  ): Promise<ApiResponseData<Page<GptResponseDto>>> {
    try {
      const { page, limit, search, status, order, orderBy } = pageOptions;
      const offset = (page - 1) * limit;

      const queryBuilder = this.gptRepository
        .createQueryBuilder('gpt')
        .select([
          'gpt.id',
          'gpt.name',
          'gpt.image',
          'gpt.description',
          'gpt.goal',
          'gpt.temperature',
          'gpt.created_at',
        ])
        .limit(limit)
        .offset(offset);

      if (search) {
        queryBuilder.andWhere(
          '(gpt.name ILIKE :search OR gpt.description ILIKE :search OR gpt.goal ILIKE :search)',
          { search: `%${search}%` },
        );
      }

      if (orderBy) {
        const validColumns = ['name', 'goal', 'temperature', 'created_at'];
        if (!validColumns.includes(orderBy)) {
          throw new BadRequestException(
            `Campo de ordenação inválido: ${orderBy}`,
          );
        }
        queryBuilder.orderBy(`gpt.${orderBy}`, order || 'ASC');
      } else {
        queryBuilder.orderBy('gpt.created_at', order || 'ASC');
      }

      const itemCount = await queryBuilder.getCount();
      const data = await queryBuilder.getMany();

      const pageMetaDto = new PageMeta({ itemCount, pageOptions });
      const pageDto = new Page(data, pageMetaDto);

      return {
        error: false,
        message: 'GPTs encontrados com sucesso!',
        data: pageDto,
      };
    } catch (error) {
      console.error('Erro ao buscar GPTs:', error);
      throw new InternalServerErrorException('Erro ao buscar GPTs');
    }
  }

  /**
   * Retorna um GPT específico.
   *
   * @param {string} id ID do GPT.
   * @returns {Promise<ApiResponseData<GptEntity>>}
   */
  async findById(id: string): Promise<ApiResponseData<GptResponseDto>> {
    const gpt = await this.gptRepository.findOne({
      where: { id },
    });

    if (!gpt) {
      throw new NotFoundException('GPT não encontrado');
    }

    return {
      message: 'GPT encontrado com sucesso!',
      error: false,
      data: gpt,
    };
  }
}
