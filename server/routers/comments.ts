import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { Context } from "../../pages/api/trpc/[trpc]";
import db from "../../prisma/db";

const t = initTRPC.context<Context>().create();

const router = t.router
const procedure = t.procedure

export const commentRouter = router({
    all: procedure
        .input(z.string())
        .query(async ({ input }) => {
            return await db.comment.findMany({
                where: {
                    postId: input
                }
            })
        }),
    count: procedure
        .input(z.string())
        .query(async ({ input }) => {
            return await db.comment.count({
                where: {
                    postId: input
                }
            })
        }),
    addComment: procedure
        .input(z.object({
            content: z.string().max(255).min(1),
            postId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user)
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            try {
                await db.comment.create({
                    data: { ...input, userId: ctx.user.sub! }
                })
            }
            catch (err: any) {
                console.log(err)
            }

        }),
    editComment: procedure
        .input(z.object({
            content: z.string().max(255).min(1),
            commentId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user)
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            try {
                const comment = await db.comment.findUnique({
                    where: {
                        commentId: input.commentId
                    }
                })
                if (!comment)
                    throw new TRPCError({ code: "NOT_FOUND", message: "comment not found" })
                if (comment.userId != ctx.user.sub)
                    throw new TRPCError({ code: "FORBIDDEN", message: "user mismatch" })

                await db.comment.update({
                    where: {
                        commentId: input.commentId,
                    },
                    data: {
                        content: input.content,
                        editDate: new Date()
                    }
                })
                return
            }
            catch (err: any) {
                console.log(err)
            }

        }),
    deleteComment: procedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user)
                throw new TRPCError({ code: 'UNAUTHORIZED' })

            try {
                const comment = await db.comment.findUnique({
                    where: {
                        commentId: input
                    }
                })
                if (!comment)
                    throw new TRPCError({ code: "NOT_FOUND", message: "comment not found" })
                if (comment.userId != ctx.user.sub)
                    throw new TRPCError({ code: "FORBIDDEN", message: "user mismatch" })

                await db.comment.delete({
                    where: {
                        commentId: input
                    }
                })
                return
            } 
            catch (e: any) {
                
            }
        }),
})