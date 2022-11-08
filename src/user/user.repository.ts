import { Post, PostDocument } from './../post/schemas/post.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, ObjectId } from 'mongoose';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async removeFavorite(postId: string, userId: string) {
    const users = await this.userModel.find();

    const posts = await this.postModel.find();

    const objUserId = users.find((user) => user.userId === userId)._id;

    const objPostId = posts.find((post) => post.postId === postId)._id;

    await this.userModel.findByIdAndUpdate(
      objUserId,
      {
        $pull: {
          favorites: objPostId,
        },
      },
      { new: true },
    );

    return { message: 'Favorite post deleted' };
  }

  async unFollow(followerId: string, userId: string) {
    const users = await this.userModel.find();

    const objUserId = users.find((user) => user.userId === userId)._id;

    const objFollowerId = users.find((user) => user.userId === followerId)._id;

    await this.userModel.findByIdAndUpdate(
      objUserId,
      {
        $pull: {
          followers: objFollowerId,
        },
      },
      { new: true },
    );

    return { message: 'Successful unfollow' };
  }

  async getUserFavorites(userId: string) {
    const result: any = await this.userModel
      .find({ userId })
      .populate('favorites', '', this.postModel)
      .exec();

    return result.map(({ favorites }) => favorites).flat();
  }

  async addFavorite(post: Post, userId: string) {
    await this.userModel.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          favorites: post,
        },
      },
    );
  }

  async addFollower(user: any, userId: string) {
    await this.userModel.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          followers: user,
        },
      },
    );
  }

  async findOne(id: string) {
    const users = await this.userModel.find().exec();
    const userId = await users.find((user) => user.userId === id)?._id;

    const result = await this.userModel
      .findOne(userId)
      .populate('favorites', '', this.postModel)
      .populate('followers', '', this.userModel)
      .exec();

    return result;
  }

  async findUserById(id: string) {
    return this.userModel.find({ userId: id });
  }

  async find(usersFilterQuery: FilterQuery<User>): Promise<User[]> {
    return this.userModel
      .find(usersFilterQuery)
      .populate('favorites', '', this.postModel)
      .populate('followers', '', this.userModel)
      .exec();
  }

  async create(user: User): Promise<User> {
    const newUser = new this.userModel(user);

    return await newUser.save();
  }

  async findOneBy(cond: LoginUserDto): Promise<User> {
    return this.userModel.findOne(cond);
  }

  async findOneAndUpdate(_id: string, dto: UpdateUserDto): Promise<any> {
    const users = await this.userModel.find();
    const result = await this.userModel.findByIdAndUpdate(
      users.find((user) => user.userId === _id)._id,
      dto,
    );

    return result;
  }

  async delete(id: string) {
    return this.userModel.deleteOne({ id });
  }

  async updateAvatar(userId: string, avatarUrl: string) {
    return await this.userModel.findOneAndUpdate(
      { userId: userId },
      {
        $set: {
          avatarUrl: avatarUrl,
        },
      },
    );
  }
}
