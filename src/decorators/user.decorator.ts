import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserSchema } from './../user/schemas/user.schema';

export const UserDecorator = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserSchema => {
    const request = ctx.switchToHttp().getRequest();

    return request.user.userId;
  },
);
