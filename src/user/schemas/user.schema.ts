import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Post } from 'src/post/schemas/post.schema';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop()
  userId: string;

  @Prop()
  fullName: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: [Types.ObjectId], ref: Post.name })
  favorites?: Post[];

  @Prop({ type: [Types.ObjectId], ref: User.name })
  followers?: User[];
}

export const UserSchema = SchemaFactory.createForClass(User);
