import { ApiProperty } from '@nestjs/swagger';
import { PageMeta } from 'src/db/pagination/page-meta.dto';
import { IsArray } from 'class-validator';
import { GptResponseDto } from './gpt.dto';

/**
 * @class ApiResponseUserList
 *
 * DTO para receber no swagger as informações da lista de usuários.
 */

export class GptPage {
  @IsArray()
  @ApiProperty({ isArray: true, type: GptResponseDto })
  readonly data: GptResponseDto[];

  @ApiProperty({ type: () => PageMeta })
  readonly meta: PageMeta;

  constructor(data: GptResponseDto[], meta: PageMeta) {
    this.data = data;
    this.meta = meta;
  }
}

/**
 * @class ApiResponseUserList
 *
 * DTO para receber no swagger as informações da lista de usuários.
 */

export class ApiResponseGptList {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Usuário encontrado com sucesso!' })
  message: string;

  @ApiProperty({ type: GptPage })
  data?: GptPage;
}

/**
 * @class ApiResponseUser
 *
 * DTO para receber no swagger as informações do usuário.
 */

export class ApiResponseGpt {
  @ApiProperty({ example: false })
  error: boolean;

  @ApiProperty({ example: 'Usuário encontrado com sucesso!' })
  message: string;

  @ApiProperty({ type: GptResponseDto, nullable: true })
  data?: GptResponseDto | null;
}
