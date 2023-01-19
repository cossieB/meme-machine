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
})
