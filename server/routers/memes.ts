import { Prisma } from "@prisma/client";
import type { Meme } from "@prisma/client";
import { initTRPC, TRPCError } from "@trpc/server";
import { z } from "zod";
import { Context } from "../../pages/api/trpc/[trpc]";
import db from "../../prisma/db";
import { genericApiError as genericErrorMsg, memesPerPage } from "../../utils/globalVariables";
import uploadToImgur from "../../utils/uploadToImgur";

const t = initTRPC.context<Context>().create();

const router = t.router
const procedure = t.procedure

export const memeRouter = router({
    publishMeme: procedure
        .input(z.object({
            title: z.string(),
            description: z.string(),
            image: z.object({
                type: z.enum(['url', 'base64']),
                data: z.string()
            })
        }))
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user)
                throw new TRPCError({ code: 'UNAUTHORIZED' })
            if (input.title.length > 100)
                throw new TRPCError({ code: 'BAD_REQUEST', message: "Maximum length of title is 100 characters" })
            if (input.title.length == 0)
                throw new TRPCError({ code: 'BAD_REQUEST', message: "Title is required" })
            if (input.image.data.length == 0)
                throw new TRPCError({ code: 'BAD_REQUEST', message: "Image is required" })

            if (input.image.type == 'url') {
                // check if the image url is valid and it's an image
                const response = await fetch(input.image.data)
                    .catch(() => {
                        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid URL' })
                    })
                
                const blob = await response.blob(); 
                if (blob.type.startsWith('text/html')) throw new TRPCError({code: 'BAD_REQUEST', message: 'Invalid URL'})
                if (!blob.type.startsWith('image/')) throw new TRPCError({ code: 'BAD_REQUEST', message: 'Invalid file type' })

                const result = await db.meme.create({
                    data: { ...input, image: input.image.data, userId: ctx.user.sub! }
                })
                return result
            }

            const response = await uploadToImgur(input.image.data);
            if (!response.success)
                throw new TRPCError({ code: 'BAD_REQUEST', message: response.data?.error?.message ?? genericErrorMsg })

            const result = await db.meme.create({
                data: {
                    ...input, image: response.data.link, userId: ctx.user.sub!
                }
            })
            return result
        }),
    getMemes: procedure
        .input(z.object({
            sort: z.enum(['new', 'popular']).default('new'),
            filter: z.enum(['day', 'week', 'month', 'year', 'allTime']).default('allTime'),
            creator: z.string().nullish(),
            page: z.number().default(0)
        }))
        .query(async ({ input }) => {
            type Mapper = {
                [x in typeof input.filter]: Date
            }
            const now = new Date()
            const map: Mapper = {
                day: new Date(now.setDate(now.getDate() - 1)),
                week: new Date(now.setDate(now.getDate() - 7)),
                month: new Date(now.setMonth(now.getMonth() - 1)),
                year: new Date(now.setFullYear(now.getFullYear() - 1)),
                allTime: new Date(0)
            }

            const sort: Prisma.Enumerable<Prisma.MemeOrderByWithRelationInput> = input.sort == 'new' ? { creationDate: 'desc' } : { views: 'desc' }

            const memes = await db.meme.findMany({
                where: {
                    ...(input.sort == 'popular' && {
                        creationDate: {
                            gte: map[input.filter]
                        }
                    }),
                    ...(input.creator && {
                        user: {
                            username_lower: input.creator.toLowerCase()
                        }
                    }),
                },
                take: memesPerPage + 1,
                skip: input.page * memesPerPage,
                orderBy: sort,
            })
            return {
                memes: memes.slice(0, memesPerPage),
                isLastPage: memes.length <= memesPerPage
            }
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
                        }
                    }
                }
            })
            if (!result) throw new TRPCError({ code: "NOT_FOUND" })
            return result
        }),
    viewMeme: procedure
        .input(z.string())
        .mutation(async ({ input }) => {
            try {
                await db.meme.update({
                    where: {
                        postId: input
                    },
                    data: {
                        views: {
                            increment: 1
                        }
                    }
                })
                return
            }
            catch (error: any) {
                // error P2025 is a known error. It means no item to update was found
                if (error.code != 'P2025') throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
            }
        }),
    homeFeed: procedure
        .input(z.object({
            page: z.number().default(0)
        }))
        .query(async ({ ctx, input }) => {
            type ApiResponse = {
                memes: Meme[],
                isLastPage: boolean
            };
            if (!ctx.user) {
                const memes = await db.meme.findMany({
                    take: memesPerPage + 1,
                    skip: input.page * memesPerPage,
                    orderBy: {
                        creationDate: 'desc'
                    },
                })
                return {
                    memes: memes.slice(0, memesPerPage),
                    isLastPage: memes.length <= memesPerPage
                }
            }
            const memes: Meme[] = await db.$queryRaw`
                SELECT "postId", "userId", "creationDate", "editDate", title, image, description, views
                FROM "Meme"
                WHERE "userId" 
                IN (
                    SELECT "followeeId" 
                    FROM "FollowerFollowee"
                    WHERE "followerId" = ${ctx.user.sub!}
                )
                OR "userId" = ${ctx.user.sub}
                ORDER BY "creationDate" DESC
                LIMIT ${memesPerPage + 1}
                OFFSET ${input.page * memesPerPage}
            `
            return {
                memes: memes.slice(0, memesPerPage),
                isLastPage: memes.length <= memesPerPage
            }
        }),
    delete: procedure
        .input(z.string())
        .mutation(async ({ ctx, input }) => {
            if (!ctx.user)
                throw new TRPCError({ code: "UNAUTHORIZED" })
            const meme = await db.meme.findUnique({
                where: {
                    postId: input,
                }
            })
            if (!meme)
                throw new TRPCError({ code: "NOT_FOUND" })

            if (meme.userId != ctx.user.sub)
                throw new TRPCError({ code: "FORBIDDEN", message: "user mismatch" })

            await db.meme.delete({
                where: {
                    postId: input,
                }
            })
            return
        }),
    search: procedure
        .input(z.object({
            term: z.string(),
            page: z.number().default(0)
        }))
        .mutation(async ({ input }) => {
            const memes = await db.meme.findMany({
                where: {
                    title: {
                        contains: input.term,
                        mode: 'insensitive'
                    }
                },
                take: memesPerPage + 1,
                skip: input.page * memesPerPage,
            })
            return {
                memes: memes.slice(0, memesPerPage),
                isLastPage: memes.length <= memesPerPage
            }
        })
})