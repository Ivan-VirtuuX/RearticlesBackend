import {
  Request,
  Controller,
  Get,
  Body,
  Param,
  Post,
  UseGuards,
  Patch,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getUser(@Param('id') _id: string): Promise<User> {
    return this.userService.findById(_id);
  }

  @Get()
  async getUsers() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/favorites')
  addFavorite(@Param('id') userId, @Body() { postId }: { postId: string }) {
    return this.userService.addFavorite(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/followers')
  addFollower(
    @Param('id') userId,
    @Body() { followerId }: { followerId: string },
  ) {
    return this.userService.addFollower(followerId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/favorites')
  removeFavorite(@Param('id') userId, @Body() { postId }: { postId: string }) {
    return this.userService.removeFavorite(postId, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/followers')
  unFollow(
    @Param('id') userId: string,
    @Body() { followerId }: { followerId: string },
  ) {
    return this.userService.unFollow(followerId, userId);
  }

  @Get(':id/favorites')
  getUserFavorites(@Param('id') userId: string) {
    return this.userService.getUserFavorites(userId);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async updateAvatar(
    @Param('id') userId: string,
    @Body() { avatarUrl }: { avatarUrl: string },
  ) {
    return this.userService.updateAvatar(userId, avatarUrl);
  }
}
