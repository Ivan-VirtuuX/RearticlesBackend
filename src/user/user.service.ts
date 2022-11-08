import { PostService } from './../post/post.service';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from './user.repository';
import { User } from './schemas/user.schema';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    @Inject(forwardRef(() => PostService))
    private readonly postService: PostService,
  ) {}

  async getUserFavorites(userId: string) {
    return await this.repository.getUserFavorites(userId);
  }

  async addFavorite(postId: string, userId: string) {
    const posts = await this.postService.findAll();
    const user = await this.repository.find({ userId });
    const post = posts.find((post) => post.postId === postId);

    if (!user[0].favorites.some((favorite) => favorite.postId === postId))
      return await this.repository.addFavorite(post, userId);
  }

  async addFollower(followerId: string, userId: string) {
    const user = await this.repository.find({ userId });

    const objFollowerId: any = await this.repository.findUserById(followerId);

    const follower: any = await this.repository.find({ userId: followerId });

    if (!user[0].followers.includes(objFollowerId[0]._id))
      return await this.repository.addFollower(
        {
          _id: follower[0]._id,
          userId: follower[0].userId,
          email: follower[0].email,
          fullName: follower[0].fullName,
          avatarUrl: follower[0].avatarUrl,
          createdAt: follower[0].createdAt,
          updatedAt: follower[0].updatedAt,
        },
        userId,
      );
  }

  async unFollow(followerId: string, userId: string) {
    return await this.repository.unFollow(followerId, userId);
  }

  async removeFavorite(postId: string, userId: string) {
    return await this.repository.removeFavorite(postId, userId);
  }

  async create(dto: CreateUserDto): Promise<User> {
    return this.repository.create({
      userId: uuidv4(),
      fullName: dto.fullName,
      avatarUrl: '',
      email: dto.email,
      password: dto.password,
      favorites: [],
      followers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async findAll() {
    return this.repository.find({});
  }

  async findById(_id: string): Promise<User> {
    return this.repository.findOne(_id);
  }

  async findByCond(cond: LoginUserDto): Promise<User> {
    return this.repository.findOneBy(cond);
  }

  async update(_id: string, dto: UpdateUserDto): Promise<User> {
    const result = await this.repository.findOneAndUpdate(_id, dto);

    return result;
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return await this.repository.updateAvatar(userId, avatarUrl);
  }
}
