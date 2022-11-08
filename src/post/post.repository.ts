import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { AddCommentDto } from './dto/add-comment.dto';
import { CreatePostDto } from './dto/create-post.dto';
import { Post, PostDocument } from './schemas/post.schema';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from './../user/schemas/user.schema';

@Injectable()
export class PostRepository {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  async findAllPostsComments() {
    const result: any = await this.postModel
      .find()
      .populate('comments.author', '', this.userModel)
      .exec();

    return result.map(({ comments }) => comments).flat();
  }

  async searchByTitle(title: string) {
    return await this.postModel.find({
      title: { $regex: title, $options: 'i' },
    });
  }

  async findOne(_id: string): Promise<Post> {
    const posts = await this.postModel.find();

    const result = await this.postModel.findById(
      posts.find((post) => post.postId === _id)?._id,
    );

    return result;
  }

  async find(postsFilterQuery: FilterQuery<Post>): Promise<Post[]> {
    return this.postModel.find(postsFilterQuery);
  }

  async findComments(postId: string): Promise<any> {
    const posts = await this.postModel.find();

    const { comments } = await this.postModel
      .findById(posts.find((post) => post.postId === postId)?._id)
      .populate('comments.author', '', this.userModel)
      .exec();

    return comments;
  }

  async create(post: Post): Promise<Post> {
    const newPost = new this.postModel(post);

    const result = await newPost.save();

    return result;
  }

  async addComment(dto: AddCommentDto, id: string, user: any) {
    const posts = await this.postModel.find();
    const postId = await posts.find((post) => post.postId === id);

    const createdAt = new Date();

    await this.postModel.findOneAndUpdate(
      { _id: postId?._id },
      {
        $push: {
          comments: {
            commentId: uuidv4(),
            postId: postId.postId,
            text: dto.text,
            createdAt: createdAt,
            author: user._id,
          },
        },
      },
    );

    return {
      text: dto.text,
      author: user,
      createdAt: createdAt,
    };
  }

  async removeComment(commentId, postId: string) {
    const posts = await this.postModel.find();

    const currPostId = posts.find((post) => post.postId === postId)._id;

    await this.postModel.findByIdAndUpdate(
      currPostId,
      {
        $pull: {
          comments: { commentId: commentId.commentId },
        },
      },
      { new: true },
    );

    return { message: 'Comment deleted' };
  }

  async findOneBy(cond: CreatePostDto): Promise<Post> {
    return this.postModel.findOne(cond);
  }

  async findOneAndUpdate(
    userFilterQuery: FilterQuery<Post>,
    user: Partial<Post>,
  ): Promise<Post> {
    return this.postModel.findOneAndUpdate(userFilterQuery, user);
  }
}
