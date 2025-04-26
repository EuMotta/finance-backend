import { UserEntity } from 'src/db/entities/user.entity';
import { CreateGptDto } from './create-gpt.dto';

export class GptResponseDto extends CreateGptDto {
  id: string;
  user: UserEntity;
}
