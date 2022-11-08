import { Inject, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { PostRepository } from './post.repository';
import { Post } from './schemas/post.schema';
import { v4 as uuidv4 } from 'uuid';
import { AddCommentDto } from './dto/add-comment.dto';
import { UserService } from './../user/user.service';

@Injectable()
export class PostService {
  @Inject(UserService)
  private readonly userService: UserService;

  constructor(private readonly repository: PostRepository) {}

  async removeComment(commentId: string, postId: string) {
    return await this.repository.removeComment(commentId, postId);
  }

  async findAllPostsComments() {
    return await this.repository.findAllPostsComments();
  }

  async create(dto: CreatePostDto): Promise<Post> {
    const firstParagraph = dto.body.find((obj) => obj.type === 'paragraph')
      ?.data?.text;

    return await this.repository.create({
      postId: uuidv4(),
      title: dto.title,
      body: dto.body,
      description: firstParagraph || '',
      comments: [],
      userId: dto.id,
      views: 0,
      tags: dto?.tags,
      createdAt: new Date(),
    });
  }

  async findAll(): Promise<Post[]> {
    return this.repository.find({});
  }

  async addComment(dto: AddCommentDto, postId: string, { id }) {
    const {
      _id,
      userId,
      fullName,
      email,
      createdAt,
      updatedAt,
      avatarUrl,
    }: any = await this.userService.findById(id);

    const author: any = {
      _id,
      userId,
      fullName,
      email,
      createdAt,
      updatedAt,
      avatarUrl,
    };

    return await this.repository.addComment(dto, postId, author);
  }

  async getPostComments(postId: string) {
    return this.repository.findComments(postId);
  }

  async findById(_id: string): Promise<Post> {
    return await this.repository.findOne(_id);
  }

  async search(title: string) {
    return await this.repository.searchByTitle(title);
  }
}
