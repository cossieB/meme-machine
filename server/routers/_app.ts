import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import { procedure, router } from '../trpc';

type User = {
    name: string,
    age: number
}

const users: User[] = []

export const appRouter = router({
    hella: procedure
        .input(
            z.object({
                name: z.string(),
                age: z.number()
            }),
        )
        .query(({ input }) => {
            return {
                greeting: `hello ${input.name} who is ${input.age} years old`,
            };
        }),
    create: procedure
        .input(z.object({
            name: z.string(), 
            age: z.number()
        }))
        .mutation(req => {
            users.push(req.input)
            return users
        }),
    test: procedure
        
        .query(async (ctx) => {
            console.log(ctx)
            // const token = await getToken(ctx);
            // console.log(token)
            return true
        })
});

// export type definition of API
export type AppRouter = typeof appRouter;