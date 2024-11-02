import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { getContextValue } from './context.js';
import { createGqlResponseSchema, gqlResponseSchema, gqlSchema } from './schemas.js';

const DEPTH_LIMIT = 5;

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;
  const contextValue = getContextValue(prisma);

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query: source, variables: variableValues } = req.body;
      const errors = validate(gqlSchema, parse(source), [depthLimit(DEPTH_LIMIT)]);

      if (errors.length) {
        return { errors };
      }

      return graphql({
        schema: gqlSchema,
        source,
        variableValues,
        contextValue,
      });
    },
  });
};

export default plugin;
