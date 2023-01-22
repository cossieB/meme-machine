import { inferAsyncReturnType } from '@trpc/server';
import * as trpcNext from '@trpc/server/adapters/next';
import { CreateNextContextOptions } from '@trpc/server/adapters/next';
import { getToken } from 'next-auth/jwt';
import { appRouter } from '../../../server/routers/_app';

// export API handler
// @see https://trpc.io/docs/api-handler
export default trpcNext.createNextApiHandler({
    router: appRouter,
    createContext
});

async function createContext({ req }: CreateNextContextOptions) {
    const user = await getToken({req});
    return {user}
}

export type Context = inferAsyncReturnType<typeof createContext>;