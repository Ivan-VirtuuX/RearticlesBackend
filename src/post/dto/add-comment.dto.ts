import { IsString } from 'class-validator';
import { User } from './../../user/schemas/user.schema';

export class AddCommentDto {
  @IsString()
  text: string;

  author: User;
}
