import NextAuth from 'next-auth'
import FacebookProvider from 'next-auth/providers/facebook'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'

export default NextAuth({
    providers: [
        // OAuth authentication providers...

        FacebookProvider({
            clientId: process.env.FACEBOOK_ID!,
            clientSecret: process.env.FACEBOOK_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!
        })
        // Passwordless / email sign in
    ]
})