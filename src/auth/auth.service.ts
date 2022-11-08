import { CreateUserDto } from './../user/dto/create-user.dto';
import { UserService } from '../user/user.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from './../user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async getMe(_id: string) {
    this.userService.findById(_id);
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByCond({
      email,
      password,
    });

    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  generateJwtToken(userData: any) {
    const payload = {
      email: userData._doc.email,
      userId: userData._doc.userId,
    };

    return this.jwtService.sign(payload);
  }

  async login(user) {
    const { password, ...userData } = user;

    return {
      ...userData._doc,
      token: this.generateJwtToken(userData),
    };
  }

  async register(dto: CreateUserDto) {
    try {
      const { password, ...userData }: any = await this.userService.create({
        email: dto.email,
        fullName: dto.fullName,
        password: dto.password,
      });

      return {
        id: userData._doc.userId,
        fullName: userData._doc.fullName,
        email: userData._doc.email,
        token: this.generateJwtToken(userData),
      };
    } catch (err) {
      throw new ForbiddenException('Ошибка при регистрации');
    }
  }
}
