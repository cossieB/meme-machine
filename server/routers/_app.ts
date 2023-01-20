import { router } from '../trpc';
import { followRouter } from './follows';
import { likesRouter } from './likes';
import { memeRouter } from './memes';
import { userRouter } from './users';

export const appRouter = router({
    user: userRouter,
    meme: memeRouter,
    like: likesRouter,
    follow: followRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;