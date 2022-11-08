import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OutputBlockData } from '../dto/create-post.dto';
import { Comment } from './comment.schema';

export type PostDocument = Post & Document;

@Schema()
export class Post {
  @Prop()
  postId: string;

  @Prop()
  title: string;

  @Prop()
  body: OutputBlockData[];

  @Prop([String])
  description: string;

  @Prop()
  comments: Comment[];

  @Prop()
  userId: string;

  @Prop()
  views?: number;

  @Prop()
  tags?: string[];

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const PostSchema = SchemaFactory.createForClass(Post);
