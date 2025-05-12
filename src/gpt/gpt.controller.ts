import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { GptService } from './gpt.service';
import { CreateGptDto } from './dto/create-gpt.dto';
import { ApiResponseSuccess } from 'src/utils/db-response.dto';
import { AxiosErrorResponse } from 'src/utils/error.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiResponseData } from 'src/interfaces/api';
import { GptResponseDto } from './dto/gpt.dto';
import { Page } from 'src/db/pagination/page.dto';
import { PageOptions } from 'src/db/pagination/page-options.dto';
import { Throttle } from '@nestjs/throttler';
import { TokenPayload } from 'src/interfaces/token.interface';
import { GetUser } from 'src/decorators/get-user.decorator';
import { ApiResponseGptList } from './dto/gpt-swagger-response';

@UseGuards(AuthGuard)
@ApiTags('gpts')
@Controller('gpts')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Throttle({ default: { limit: 1, ttl: 500 } })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar novo GPT',
    description: 'Cria um novo recurso GPT no sistema com os dados fornecidos.',
    operationId: 'createGpt',
  })
  @ApiResponse({ status: HttpStatus.CREATED, type: ApiResponseSuccess })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: AxiosErrorResponse })
  @ApiBody({ type: CreateGptDto })
  async create(
    @Body() gpt: CreateGptDto,
    @GetUser() token: TokenPayload,
  ): Promise<ApiResponseSuccess> {
    return this.gptService.create(gpt, token);
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Listar GPTs',
    description:
      'Retorna uma lista paginada de todos os GPTs cadastrados. Pode filtrar, ordenar e pesquisar por parâmetros opcionais.',
    operationId: 'getAllGpts',
  })
  @ApiResponse({ status: HttpStatus.OK, type: ApiResponseGptList })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: AxiosErrorResponse })
  @ApiQuery({ name: 'page', type: Number, required: false, default: 1 })
  @ApiQuery({ name: 'limit', type: Number, required: false, default: 10 })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getAll(
    @Query() query: PageOptions,
  ): Promise<ApiResponseData<Page<GptResponseDto>>> {
    return this.gptService.getAll(query);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Buscar GPT por ID',
    description: 'Busca um GPT específico a partir do seu ID único.',
    operationId: 'getGptById',
  })
  @ApiResponse({ status: HttpStatus.OK, type: GptResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, type: AxiosErrorResponse })
  async findById(
    @Param('id') id: string,
  ): Promise<ApiResponseData<GptResponseDto>> {
    return this.gptService.findById(id);
  }
}
