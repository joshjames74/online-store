import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '../../../../lib/prisma';


const authOptions = {
  //adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // callbacks: {
  //   async signIn({ user, account, profile }) {
  //     // what if existing user doesn't work but there is a user?
  //     // Check if the user already exists

  //     console.log(user, account, profile);
  //     const existingUser = await prisma.usr.findUnique({
  //       where: { email: profile.email },
  //     });
  //     console.log(existingUser);

  //     // If the user does not exist, create a new user
  //     if (!existingUser) {
  //       await prisma.usr.create({
  //         data: {
  //           name: profile.name,
  //           email: profile.email,
  //           image_url: profile.picture,
  //         },
  //       });
  //     }
  //     return true;
  //   },
  // },
 
  //session: { strategy: 'jwt' },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST};