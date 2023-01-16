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
        .input(z.object({
            username: z.string(),
            image: z.string()
        }))
        .query(({ctx, input}) => {
            return input.username == ctx.user?.name && input.image == ctx.user.picture
            
        })
});

// export type definition of API
export type AppRouter = typeof appRouter;