import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GptController } from './gpt.controller';
import { GptEntity } from 'src/db/entities/gpt.entity';
import { GptService } from './gpt.service';

@Module({
  controllers: [GptController],
  imports: [TypeOrmModule.forFeature([GptEntity])],
  exports: [GptService],
  providers: [GptService],
})
export class GptModule {}
