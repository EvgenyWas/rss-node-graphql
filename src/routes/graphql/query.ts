import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import {
  parseResolveInfo,
  ResolveTree,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

import { Context } from './context.js';
import { MemberIdType, MemberType } from './types/member.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';

export interface EntityArgs {
  id: string;
}

export const Query = new GraphQLObjectType<unknown, Context>({
  name: 'RootQueryType',
  fields: {
    memberTypes: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(MemberType))),
      resolve(_src, _, ctx) {
        return ctx.prisma.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: { id: { type: new GraphQLNonNull(MemberIdType) } },
      resolve(_, { id }: EntityArgs, ctx) {
        return ctx.prisma.memberType.findUnique({ where: { id } });
      },
    },
    users: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      async resolve(_src, _, ctx, info) {
        const parsedInfo = parseResolveInfo(info) as ResolveTree;
        const { fields } = simplifyParsedResolveInfoFragmentWithType(
          parsedInfo,
          new GraphQLList(UserType),
        );
        const users = await ctx.prisma.user.findMany({
          include: {
            userSubscribedTo: 'userSubscribedTo' in fields && !!fields.userSubscribedTo,
            subscribedToUser: 'subscribedToUser' in fields && !!fields.subscribedToUser,
          },
        });

        users.forEach((user) => ctx.userLoader.prime(user.id, user));

        return users;
      },
    },
    user: {
      type: UserType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve(_, { id }: EntityArgs, ctx) {
        return ctx.userLoader.load(id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve(_src, _, ctx) {
        return ctx.prisma.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve(_, { id }: EntityArgs, ctx) {
        return ctx.prisma.post.findUnique({ where: { id } });
      },
    },
    profiles: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(ProfileType))),
      resolve(_src, _, ctx) {
        return ctx.prisma.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: { id: { type: new GraphQLNonNull(UUIDType) } },
      resolve(_, { id }: EntityArgs, ctx) {
        return ctx.prisma.profile.findUnique({ where: { id } });
      },
    },
  },
});
