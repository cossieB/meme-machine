import { User } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { Context } from "../../pages/api/trpc/[trpc]";
import db from "../../prisma/db";
import { UserDto } from "../../types/DTOs";

const t = initTRPC.context<Context>().create();

const router = t.router
const procedure = t.procedure

export const followRouter = router({
    follow: procedure
        .input(z.string())
        .mutation(async ({ input, ctx }) => {
            if (!ctx.user)
                throw new TRPCError({ code: 'UNAUTHORIZED' })

            try {
                await db.followerFollowee.create({
                    data: {
                        followerId: ctx.user.sub!,
                        followeeId: input
                    }
                })
            }
            catch (e: any) {
                if (e.code == 'P2002') {
                    await db.followerFollowee.delete({
                        where: {
                            followeeId_followerId: {
                                followerId: ctx.user.sub!,
                                followeeId: input
                            }
                        }
                    })
                    return
                }
                if (e.code == 'P2003') {
                    throw new TRPCError({ code: 'BAD_REQUEST', message: "User not found" })
                }
                console.log(e)
                throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: "Something went wrong" })
            }
            return true
        }),
    unfollow: procedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user) {
                throw new TRPCError({ code: "UNAUTHORIZED" })
            }
            try {
                await db.followerFollowee.delete({
                    where: {
                        followeeId_followerId: {
                            followerId: ctx.user.sub!,
                            followeeId: input
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
    doesUserFollow: procedure
        .input(z.string())
        .query(async ({ctx, input}) => {
            if (!ctx.user) {
                throw new TRPCError({ code: "UNAUTHORIZED" })
            }
            try {
                const result = await db.followerFollowee.findUnique({
                    where: {
                        followeeId_followerId: {
                            followerId: ctx.user.sub!,
                            followeeId: input
                        }
                    }
                })
                return !!result
            } 
            catch (e: any) {
                
            }
        }),
    followingWho: procedure
        .input(z.string())
        .query(async ({input}) => {
            return await db.$queryRaw`
                SELECT DISTINCT("User".id), "User".username, "User".image, "User"."joinDate", "User".status,  "User".banner
                FROM "User"
                JOIN "FollowerFollowee"
                ON "followeeId" = id
                WHERE "followerId" = (
                    SELECT id 
                    FROM "User"
                    WHERE username_lower = ${input.toLowerCase()}
                )
            ` as UserDto[]
        }),
    followedBy: procedure
        .input(z.string())
        .query(async ({input}) => {
            return await db.$queryRaw`
                SELECT DISTINCT("User".id), "User".username, "User".image, "User"."joinDate", "User".status,  "User".banner
                FROM "User"
                JOIN "FollowerFollowee"
                ON "followerId" = id
                WHERE "followeeId" = (
                    SELECT id 
                    FROM "User"
                    WHERE username_lower = ${input.toLowerCase()}
                )                
            ` as UserDto[]
        })
})