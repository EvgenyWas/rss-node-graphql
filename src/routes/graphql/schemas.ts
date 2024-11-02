import { Type } from '@fastify/type-provider-typebox';
import { GraphQLSchema } from 'graphql';

import { Mutation } from './mutation.js';
import { Query } from './query.js';
import { memberTypes } from './types/member.js';
import { postTypes } from './types/post.js';
import { profileTypes } from './types/profile.js';
import { userTypes } from './types/user.js';
import { UUIDType } from './types/uuid.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const gqlSchema = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
  types: [...memberTypes, ...postTypes, ...profileTypes, ...userTypes, UUIDType],
});
