import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { Context } from "../../pages/api/trpc/[trpc]";
import db from "../../prisma/db";

const t = initTRPC.context<Context>().create();

const router = t.router
const procedure = t.procedure

export const userRouter = router({
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
                    image: true,
                    banner: true,
                    id: true
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
        .mutation(async ({ input, ctx }) => {
            if (!ctx.user)
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            if (input.username.length < 3 || input.username.length > 20)
                throw new TRPCError({ code: 'BAD_REQUEST', message: "Username must be between 3 and 20 characters" })
            if (input.status.length > 255)
                throw new TRPCError({ code: 'BAD_REQUEST', message: "Maximum length of status is 255 characters" })
            try {
                await db.user.update({
                    where: {
                        email: ctx.user.email!
                    },
                    data: { ...input, username_lower: input.username.toLowerCase() }
                })
                return true
            }
            catch (e: any) {
                if (e.code == 'P2002')
                    throw new TRPCError({code: 'BAD_REQUEST', message: 'username already taken'})
                console.error(e);
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
            }
        }),
    getUser: procedure
        .input(z.string())
        .query(async ({ input }) => {
            const result = await db.user.findUnique({
                where: {
                    username_lower: input.toLowerCase()
                },
                select: {
                    username: true,
                    image: true,
                    joinDate: true,
                    status: true,
                    id: true,
                    banner: true
                }
            })
            if (!result)
                throw new TRPCError({ code: 'NOT_FOUND', message: "User not found" })
            return result
        }),
    byId: procedure
    .input(z.string())
    .query(async ({ input }) => {
        const result = await db.user.findUnique({
            where: {
                id: input
            },
            select: {
                username: true,
                image: true,
                joinDate: true,
                status: true,
                id: true,
                banner: true
            }
        })
        if (!result)
            throw new TRPCError({ code: 'NOT_FOUND', message: "User not found" })
        return result
    }),
})
