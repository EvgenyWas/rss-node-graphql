import { PrismaClient } from '@prisma/client';
import DataLoader from 'dataloader';

import { MemberTypeBody } from './types/member.js';
import { PostBody } from './types/post.js';
import { ProfileBody } from './types/profile.js';
import { UserBody } from './types/user.js';

export type DataLoaders = ReturnType<typeof buildLoaders>;

export const buildLoaders = (prisma: PrismaClient) => ({
  memberTypeLoader: new DataLoader<string, MemberTypeBody>(async (ids) => {
    const memberTypes = await prisma.memberType.findMany({
      where: {
        profiles: {
          some: { memberTypeId: { in: [...ids] } },
        },
      },
    });
    const mappedMemberTypes = memberTypes.reduce<Record<string, MemberTypeBody>>(
      (acc, item) => {
        acc[item.id] = item;

        return acc;
      },
      {},
    );

    return ids.map((id) => mappedMemberTypes[id]);
  }),

  profileLoader: new DataLoader<string, ProfileBody>(async (ids) => {
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: [...ids] } },
    });
    const mappedProfiles = profiles.reduce<Record<string, ProfileBody>>(
      (acc, profile) => {
        acc[profile.userId] = profile;

        return acc;
      },
      {},
    );

    return ids.map((id) => mappedProfiles[id]);
  }),

  postsLoader: new DataLoader<string, Array<PostBody>>(async (ids) => {
    const posts = await prisma.post.findMany({ where: { authorId: { in: [...ids] } } });
    const mappedPosts = posts.reduce<Record<string, Array<PostBody>>>((acc, post) => {
      acc[post.authorId] = acc[post.authorId] || [];
      acc[post.authorId].push(post);

      return acc;
    }, {});

    return ids.map((id) => mappedPosts[id] ?? []);
  }),

  userLoader: new DataLoader<string, UserBody>(async (ids) => {
    const users = await prisma.user.findMany({
      where: { id: { in: [...ids] } },
      include: { userSubscribedTo: true, subscribedToUser: true },
    });

    const usersMap = users.reduce<Record<string, UserBody>>((acc, user) => {
      acc[user.id] = user;

      return acc;
    }, {});

    return ids.map((id) => usersMap[id]);
  }),
});
