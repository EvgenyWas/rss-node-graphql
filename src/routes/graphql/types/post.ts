import { Static } from '@sinclair/typebox';
import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  changePostByIdSchema,
  createPostSchema,
  postSchema,
} from '../../posts/schemas.js';
import { UUIDType } from './uuid.js';

export type PostBody = Static<typeof postSchema>;
export type CreatePostDto = Static<(typeof createPostSchema)['body']>;
export type ChangePostDto = Static<(typeof changePostByIdSchema)['body']>;

export const PostType = new GraphQLObjectType({
  name: 'Post',
  fields: {
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  },
});

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: {
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  },
});

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  },
});

export const postTypes = [PostType, ChangePostInputType, CreatePostInputType];
