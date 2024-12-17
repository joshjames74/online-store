import NextAuth, { SessionStrategy } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import prisma from "../../../../lib/prisma";
import { randomUUID } from "crypto";
import { postUserGenerateData } from "@/api/request/userRequest";


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
      
      const { email, name } = user;
      const sub = profile?.sub;
      
      if (!email || !sub) {
        return false;
      };
      
      try {
        // Check if the user already exists
        const existingUser = await prisma.usr.findFirst({
          where: { sub: sub },
        });
        
        if (!existingUser) {
          // Create a new user in the database
          const newUser = await prisma.usr.create({
            data: {
              id: randomUUID(),
              sub: sub,
              email: email,
              name: name,
            },
          });

          await postUserGenerateData(newUser.id);
        };
        
        return true; // Allow sign-in
      } catch (error) {
        console.error('Error during user creation:', error);
        return false; // Reject sign-in if there's an error
      }
    },
    async jwt({ token, profile }: any) {
      if (profile) {
        const user = await prisma.usr.findFirst({ where: { sub: profile.sub }});
        token.sub = profile.sub;
        token.id = user?.id;
      };
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.sub = token.sub as string;
        session.user.id = token.id as string;
      };
      return session;
    }
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
