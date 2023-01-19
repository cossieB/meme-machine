import { TRPCError } from '@trpc/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import db from '../../prisma/db';
import { procedure, router } from '../trpc';
import { memeRouter } from './memes';
import { userRouter } from './users';

export const appRouter = router({
    user: userRouter,
    meme: memeRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;