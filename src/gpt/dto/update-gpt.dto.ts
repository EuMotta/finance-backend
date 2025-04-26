import { PartialType } from '@nestjs/swagger';
import { CreateGptDto } from './create-gpt.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  MaxLength,
  IsInt,
  Min,
  Max,
  IsArray,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  IsBoolean,
} from 'class-validator';
import { Timestamps } from 'src/utils/timestamps.dto';

export class UpdateGptDto extends Timestamps {
  @ApiPropertyOptional({
    description: 'ID do usuário proprietário do GPT',
    example: '60c72b2f5f1b2c001cfb6e77',
  })
  @IsOptional()
  user?: string;

  @ApiPropertyOptional({
    description: 'Nome do GPT (máx. 100 caracteres)',
    example: 'Assistente de Marketing',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Imagem do GPT (valor entre 0 e 21)',
    example: 3,
    minimum: 0,
    maximum: 21,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(21)
  image?: number;

  @ApiPropertyOptional({
    description: 'Descrição do GPT (máx. 500 caracteres)',
    example:
      'Ferramenta voltada para ajudar com estratégias de marketing digital.',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Objetivo principal do GPT (máx. 200 caracteres)',
    example: 'Auxiliar na criação de campanhas publicitárias.',
    maxLength: 200,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  goal?: string;

  @ApiPropertyOptional({
    description: 'IDs de treinamentos associados',
    example: ['60d2ca2f3f1a4c001c2a4b8e'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  // @IsMongoId({ each: true })
  trainings?: string[];

  @ApiPropertyOptional({
    description: 'Temperatura do modelo (valor entre 0 e 1)',
    example: 0.3,
    minimum: 0,
    maximum: 1,
    default: 0.5,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature?: number;

  @ApiPropertyOptional({
    description: 'Capacidades do GPT (entre 1 e 10 itens)',
    example: ['Responder emails', 'Criar postagens para redes sociais'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  capabilities?: string[];

  @ApiPropertyOptional({
    description: 'Limitações do GPT (entre 1 e 10 itens)',
    example: ['Não compreende sarcasmo', 'Não acessa mídias sociais'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  limitations?: string[];

  @IsBoolean()
  @ApiPropertyOptional({
    description: 'Indicador se o gpt é publico',
    example: true,
  })
  is_public?: boolean;
}
