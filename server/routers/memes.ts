import { Prisma } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { input, string, z } from "zod";
import { Context } from "../../pages/api/trpc/[trpc]";
import db from "../../prisma/db";
import { trpc } from "../../utils/trpc";

const t = initTRPC.context<Context>().create();

const router = t.router
const procedure = t.procedure

export const memeRouter = router({
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
                return { id: result.postId }
            } catch (error) {
                console.log(error)
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Something went wrong. Please try again later" })
            }
        }),
    getMemes: procedure
        .input(z.object({
            sort: z.enum(['latest', 'top']).default('latest'),
            timePeriod: z.enum(['day', 'week', 'month', 'year', 'allTime']).default('allTime'),
            creator: z.string().nullish()
        }))
        .query(async ({ input }) => {
            type M = {
                [x in typeof input.timePeriod]: Date
            }
            const now = new Date()
            const map: M = {
                day: new Date(now.setDate(now.getDate() - 1)),
                week: new Date(now.setDate(now.getDate() - 7)),
                month: new Date(now.setMonth(now.getMonth() - 1)),
                year: new Date(now.setFullYear(now.getFullYear() - 1)),
                allTime: new Date(0)
            }
            const sort: Prisma.Enumerable<Prisma.MemeOrderByWithRelationInput> = input.sort == 'latest' ? { creationDate: 'asc' } : {}

            const result = await db.meme.findMany({
                where: {
                    creationDate: {
                        gte: map[input.timePeriod]
                    },
                    ...(input.creator && {
                        user: {
                            username_lower: input.creator.toLowerCase()
                        }
                    }),
                },
                orderBy: sort,
            })
            return result
        }),
    getMeme: procedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            const result = await db.meme.findUnique({
                where: {
                    postId: input
                },
                include: {
                    user: {
                        select: {
                            image: true,
                            username: true,
                            id: true
                        }
                    }
                }
            })
            if (!result) throw new TRPCError({ code: "NOT_FOUND" })
            return result
        }),
    like: procedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user) {
                throw new TRPCError({ code: "UNAUTHORIZED" })
            }
            try {
                await db.memesLikedByUser.create({
                    data: {
                        postId: input,
                        userId: ctx.user.sub!
                    }
                })
                return
            }
            catch (e: any) {
                if (e.code == 'P2002') {
                    const caller: any = memeRouter.createCaller({user: ctx.user})
                    return await caller.unlike(input)
                }
                if (e.code == 'P2003') {
                    throw new TRPCError({code: 'BAD_REQUEST', message: "Post not found"})
                }
                console.log(e)
                throw new TRPCError({code: 'INTERNAL_SERVER_ERROR', message: "Something went wrong"})

            }
        }),
    unlike: procedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user) {
                throw new TRPCError({ code: "UNAUTHORIZED" })
            }
            try {
                await db.memesLikedByUser.delete({
                    where: {
                        postId_userId: {
                            postId: input,
                            userId: ctx.user.sub!
                        }
                    }
                })
                return
            } 
            catch (error) {
                console.error(error)
                throw new TRPCError({code: "INTERNAL_SERVER_ERROR"})
            }
        })
})