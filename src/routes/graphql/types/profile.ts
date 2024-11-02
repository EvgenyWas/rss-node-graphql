import { Static } from '@sinclair/typebox';
import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import {
  changeProfileByIdSchema,
  createProfileSchema,
  profileSchema,
} from '../../profiles/schemas.js';
import { Context } from '../context.js';
import { MemberIdType, MemberType } from './member.js';
import { UUIDType } from './uuid.js';

export type ProfileBody = Static<typeof profileSchema>;
export type CreateProfileDto = Static<(typeof createProfileSchema)['body']>;
export type ChangeProfileDto = Static<(typeof changeProfileByIdSchema)['body']>;

export const ProfileType = new GraphQLObjectType<ProfileBody, Context>({
  name: 'Profile',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve(profile, _, ctx) {
        return ctx.memberTypeLoader.load(profile.memberTypeId);
      },
    },
  },
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: {
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberIdType },
  },
});

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: {
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberIdType) },
  },
});

export const profileTypes = [ProfileType, ChangeProfileInputType, CreateProfileInputType];
