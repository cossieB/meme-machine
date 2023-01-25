import NextAuth from 'next-auth'
import FacebookProvider, { FacebookProfile } from 'next-auth/providers/facebook'
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google'
import GitHubProvider, { GithubProfile } from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import db from '../../../prisma/db'

export default NextAuth({
    adapter: PrismaAdapter(db),
    callbacks: {
        async jwt({token, user}) {
            if (user)
                token.username = user.username
            return token
        },
        async session({session, token}) {
            if (token)
                session.user.username = token.username
            return session
        },
    },
    session: {
        strategy: 'jwt',
    },
    providers: [
        // OAuth authentication providers...

        FacebookProvider({
            clientId: process.env.FACEBOOK_ID!,
            clientSecret: process.env.FACEBOOK_SECRET!,
            profile(profile: FacebookProfile) {
                const rand = Math.random() * 10000
                const username = `_fb_${profile.name?.split(" ")[0] || 'user'}${rand}`
                return {
                    id: profile.id,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture.data.url,
                    username,
                    username_lower: username.toLowerCase(),
                }
            },
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
            profile(profile: GoogleProfile) {
                const rand = Math.random() * 10000
                const username = `_goog_${profile.given_name || 'user'}${rand}`
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    username,
                    username_lower: username.toLowerCase(),
                }
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
            profile(profile: GithubProfile) {
                const rand = Math.random() * 10000;
                const username = `_git_${(profile.name ?? profile.login)?.split(" ")[0] || 'user'}${rand}`
                return {
                    id: profile.id.toString(),
                    name: profile.name ?? profile.login,
                    email: profile.email,
                    image: profile.avatar_url,
                    username,
                    username_lower: username.toLowerCase(),
                }
            },
        })
        // Passwordless / email sign in
    ]
})