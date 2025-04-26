import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
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

export class CreateGptDto {
  @ApiProperty({
    description: 'Nome do GPT (máx. 100 caracteres)',
    example: 'Assistente de Vendas',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'Imagem do GPT (valor entre 0 e 21)',
    example: 5,
    minimum: 0,
    maximum: 21,
    default: 1,
  })
  @IsInt()
  @Min(0)
  @Max(21)
  image: number;

  @ApiProperty({
    description: 'Descrição do GPT (máx. 500 caracteres)',
    example:
      'Um assistente virtual treinado para responder perguntas sobre vendas.',
    maxLength: 500,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty({
    description: 'Objetivo principal do GPT (máx. 200 caracteres)',
    example: 'Ajudar usuários com estratégias de vendas.',
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  goal: string;

  @ApiProperty({
    description: 'Temperatura do modelo (valor entre 0 e 1)',
    example: 0.7,
    minimum: 0,
    maximum: 1,
    default: 0.5,
  })
  @IsNumber()
  @Min(0)
  @Max(1)
  temperature: number;

  @ApiProperty({
    description: 'Capacidades do GPT (entre 1 e 10 itens)',
    example: ['Responder dúvidas', 'Gerar textos'],
    minItems: 1,
    maxItems: 10,
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  capabilities: string[];

  @ApiProperty({
    description: 'Limitações do GPT (entre 1 e 10 itens)',
    example: [
      'Não acessa dados em tempo real',
      'Não faz previsões financeiras',
    ],
    minItems: 1,
    maxItems: 10,
    type: [String],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(10)
  @IsString({ each: true })
  limitations: string[];

  @IsBoolean()
  @ApiProperty({
    description: 'Indicador se o gpt é publico',
    example: true,
  })
  is_public?: boolean;
}
