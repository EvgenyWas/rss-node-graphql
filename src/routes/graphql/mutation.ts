import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';

import { Context } from './context.js';
import {
  ChangeUserDto,
  ChangeUserInputType,
  CreateUserDto,
  CreateUserInputType,
  UserType,
} from './types/user.js';
import {
  ChangeProfileDto,
  ChangeProfileInputType,
  CreateProfileDto,
  CreateProfileInputType,
  ProfileType,
} from './types/profile.js';
import {
  ChangePostDto,
  ChangePostInputType,
  CreatePostDto,
  CreatePostInputType,
  PostType,
} from './types/post.js';
import { UUIDType } from './types/uuid.js';

interface Args<T = object> {
  dto: T;
  id: string;
  userId: string;
  authorId: string;
}

export const Mutation = new GraphQLObjectType<unknown, Context>({
  name: 'Mutations',
  fields: {
    createUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve(_, { dto }: Args<CreateUserDto>, ctx) {
        return ctx.prisma.user.create({ data: dto });
      },
    },
    createProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve(_, { dto }: Args<CreateProfileDto>, ctx) {
        return ctx.prisma.profile.create({ data: dto });
      },
    },
    createPost: {
      type: new GraphQLNonNull(PostType),
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve(_, { dto }: Args<CreatePostDto>, ctx) {
        return ctx.prisma.post.create({ data: dto });
      },
    },
    changePost: {
      type: new GraphQLNonNull(PostType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve(_, { id, dto }: Args<ChangePostDto>, ctx) {
        return ctx.prisma.post.update({ where: { id }, data: dto });
      },
    },
    changeProfile: {
      type: new GraphQLNonNull(ProfileType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve(_, { id, dto }: Args<ChangeProfileDto>, ctx) {
        return ctx.prisma.profile.update({ where: { id }, data: dto });
      },
    },
    changeUser: {
      type: new GraphQLNonNull(UserType),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve(_, { id, dto }: Args<ChangeUserDto>, ctx) {
        return ctx.prisma.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_, { id }: Args, ctx) {
        await ctx.prisma.user.delete({ where: { id } });

        return 'deleted';
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_, { id }: Args, ctx) {
        await ctx.prisma.post.delete({ where: { id } });

        return 'deleted';
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_, { id }: Args, ctx) {
        await ctx.prisma.profile.delete({ where: { id } });

        return 'deleted';
      },
    },
    subscribeTo: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_, { userId, authorId }: Args, ctx) {
        await ctx.prisma.user.update({
          where: { id: userId },
          data: {
            userSubscribedTo: {
              create: { authorId },
            },
          },
        });

        return 'subscribed';
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLString),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      async resolve(_, { userId, authorId }: Args, ctx) {
        await ctx.prisma.subscribersOnAuthors.delete({
          where: {
            subscriberId_authorId: {
              subscriberId: userId,
              authorId,
            },
          },
        });

        return 'unsubscribed';
      },
    },
  },
});
