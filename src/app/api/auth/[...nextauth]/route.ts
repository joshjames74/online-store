import NextAuth, { SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../../lib/prisma";
import { randomUUID } from "crypto";


const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" as SessionStrategy },
  callbacks: {
    async signIn({ user, profile }: any) {
      // check we have a sub
      const { email, name } = user;
      const sub = profile?.sub;

      if (!email || !sub) {
        return false;
      }

      try {
        // Check if the user already exists
        const existingUser = await prisma.usrAuth.findFirst({ where: { sub: sub } });

        if (existingUser) {
          return true;
        }
        
        const transaction = await prisma.$transaction(async (tx) => {
          // create the user auth
          const userAuth = await tx.usrAuth.create({
            data: {
              id: randomUUID(),
              email: email,
              sub: sub,
            }
          });
          if (!userAuth) throw new Error("Cannot create user auth")
          // create the user
          const user = await tx.usr.create({ 
            data: {
              id: randomUUID(),
              name: name,
              authId: userAuth.id,
            }
          })
          if (!user) throw new Error("Cannot create user");
          return user;
        });
        if (!transaction) throw new Error("Error creating user and user auth");
        return true;
      } catch (error) {
        // Reject sign in if there's an error
        console.error("Error during user creation:", error)
        return false;
      }
    },
    async jwt({ token, profile }: any) {
      if (profile) {
        const userAuth = await prisma.usrAuth.findFirst({ where: { sub: profile.sub } });
        if (!userAuth) throw new Error("Error finding user auth");
        token.sub = profile.sub;
        token.authId = userAuth.id;
        const user = await prisma.usr.findFirst({ where: { authId: userAuth.id }});
        if (!user) throw new Error("Error finding user");
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.sub = token.sub as string;
        session.user.id = token.id as string;
        session.user.authId = token.authId as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
