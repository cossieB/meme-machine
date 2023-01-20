import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { Context } from "../../pages/api/trpc/[trpc]";
import db from "../../prisma/db";
import { memeRouter } from "./memes";


const t = initTRPC.context<Context>().create();

const router = t.router
const procedure = t.procedure

export const likesRouter = router({
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
                    const caller: any = memeRouter.createCaller({ user: ctx.user })
                    return await caller.unlike(input)
                }
                if (e.code == 'P2003') {
                    throw new TRPCError({ code: 'BAD_REQUEST', message: "Post not found" })
                }
                console.log(e)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Something went wrong" })

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
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
            }
        }),
    doesUserLike: procedure
        .input(z.string())
        .query(async ({ ctx, input }) => {
            if (!ctx.user) {
                throw new TRPCError({ code: "UNAUTHORIZED" })
            }
            const result = await db.memesLikedByUser.findUnique({
                where: {
                    postId_userId: {
                        postId: input,
                        userId: ctx.user.sub!
                    }
                }
            })
            return !!result
        }),
    likeCount: procedure
        .input(z.string())
        .query(async ({ input }) => {
            const result = await db.memesLikedByUser.aggregate({
                _count: true,
                where: {
                    postId: input
                }
            })
            return result
        }),
})