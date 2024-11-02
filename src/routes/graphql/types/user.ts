import { Static } from '@sinclair/typebox';
import {
  GraphQLFieldConfig,
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  changeUserByIdSchema,
  createUserSchema,
  userSchema,
} from '../../users/schemas.js';
import { Context } from '../context.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UUIDType } from './uuid.js';

export interface Subscription {
  authorId: string;
  subscriberId: string;
}

export type UserBody = Static<typeof userSchema> & {
  userSubscribedTo?: Array<Subscription>;
  subscribedToUser?: Array<Subscription>;
};
export type CreateUserDto = Static<(typeof createUserSchema)['body']>;
export type ChangeUserDto = Static<(typeof changeUserByIdSchema)['body']>;

export const UserType = new GraphQLObjectType<UserBody, Context>({
  name: 'User',
  fields: (): Record<string, GraphQLFieldConfig<UserBody, Context>> => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
    profile: {
      type: ProfileType,
      resolve(user, _, ctx) {
        return ctx.profileLoader.load(user.id);
      },
    },
    posts: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(PostType))),
      resolve(user, _, ctx) {
        return ctx.postsLoader.load(user.id);
      },
    },
    userSubscribedTo: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve(user, _, ctx) {
        if (!user.userSubscribedTo) {
          return null;
        }

        return ctx.userLoader.loadMany(
          user.userSubscribedTo.map(({ authorId }) => authorId),
        );
      },
    },
    subscribedToUser: {
      type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(UserType))),
      resolve(user, _, ctx) {
        if (!user.subscribedToUser) {
          return null;
        }

        return ctx.userLoader.loadMany(
          user.subscribedToUser.map(({ subscriberId }) => subscriberId),
        );
      },
    },
  }),
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: {
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  },
});

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: {
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  },
});

export const userTypes = [UserType, ChangeUserInputType, CreateUserInputType];
