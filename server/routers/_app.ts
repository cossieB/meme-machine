import { TRPCError } from '@trpc/server';
import { getToken } from 'next-auth/jwt';
import { z } from 'zod';
import db from '../../prisma/db';
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
    getMyInfo: procedure
        .query(async ({ ctx }) => {
            if (!ctx.user)
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            const result = await db.user.findUnique({
                where: {
                    email: ctx.user.email!
                },
                select: {
                    email: true,
                    name: true,
                    username: true,
                    status: true,
                    image: true
                }
            })
            if (!result)
                throw new TRPCError({ code: 'NOT_FOUND', message: "User not found" })

            return { ...result, name: result.name ?? "", image: result.image ?? "" }
        }),
    updateProfile: procedure
        .input(z.object({
            username: z.string(),
            image: z.string(),
            name: z.string(),
            status: z.string()
        }))
        .mutation(async req => {
            if (!req.ctx.user)
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            if (req.input.username.length < 3 || req.input.username.length > 20)
                throw new TRPCError({ code: 'BAD_REQUEST', message: "Username must be between 3 and 20 characters" })
            if (req.input.status.length > 255)
                throw new TRPCError({ code: 'BAD_REQUEST', message: "Maximum length of status is 255 characters" })
            try {
                await db.user.update({
                    where: {
                        email: req.ctx.user.email!
                    },
                    data: { ...req.input }
                })
                return true
            }
            catch (e: any) {
                console.error(e);
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
            }
        }),
    publishMeme: procedure
        .input(z.object({
            title: z.string(),
            description: z.string(),
            image: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user)
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            if (input.title.length > 100)
                throw new TRPCError({ code: 'BAD_REQUEST', message: "Maximum length of title is 100 characters" })
            if (input.title.length == 0)
                throw new TRPCError({ code: 'BAD_REQUEST', message: "Title is required" })
            if (input.image.length == 0)
                throw new TRPCError({ code: 'BAD_REQUEST', message: "Image is required" })
            try {
                const result = await db.meme.create({
                    data: { ...input, userId: ctx.user.sub! }
                })
                return {id: result.postId}
            } catch (error) {
                console.log(error)
                throw new TRPCError({code: "INTERNAL_SERVER_ERROR", message: "Something went wrong. Please try again later"})
            }
        })
});

// export type definition of API
export type AppRouter = typeof appRouter;