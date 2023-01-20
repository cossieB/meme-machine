import { router } from '../trpc';
import { memeRouter } from './memes';
import { userRouter } from './users';

export const appRouter = router({
    user: userRouter,
    meme: memeRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;