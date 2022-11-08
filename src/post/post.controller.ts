import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Post as PostSchema } from './schemas/post.schema';
import { AddCommentDto } from './dto/add-comment.dto';

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Post('/search')
  searchPosts(@Body() { title }: { title: string }) {
    return this.postService.search(title);
  }

  @Get('/comments')
  findAllPostsComments() {
    return this.postService.findAllPostsComments();
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/comments')
  addComment(
    @Param('id') id,
    @Body() addCommentDto: AddCommentDto,
    @Request() req,
  ) {
    return this.postService.addComment(addCommentDto, id, req.user);
  }

  @Get(':id/comments')
  getPostComments(@Param('id') postId: string) {
    return this.postService.getPostComments(postId);
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.postService.findById(_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createPostDto: CreatePostDto): Promise<PostSchema> {
    return this.postService.create(createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id/comments')
  removeComment(@Param('id') postId: string, @Body() commentId: string) {
    return this.postService.removeComment(commentId, postId);
  }
}
