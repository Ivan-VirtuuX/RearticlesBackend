import { IsEmail, Length } from 'class-validator';

export class LoginUserDto {
  @Length(6, 32, { message: 'Длина пароля должна быть минимум 6 символов' })
  password?: string;

  @IsEmail(undefined, { message: 'Неверная почта' })
  email: string;
}
