import { IsEmail, Length } from 'class-validator';
import { Unique } from 'typeorm';

export class CreateUserDto {
  @Length(3)
  fullName: string;

  @IsEmail(undefined, { message: 'Неверная почта' })
  @Unique(['email'])
  email: string;

  @Length(6, 32, { message: 'Длина пароля должна быть минимум 6 символов' })
  password?: string;
}
