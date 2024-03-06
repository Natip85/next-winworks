import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prismadb from "@/lib/prismadb";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prismadb),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "email",
          type: "text",
        },
        password: {
          label: "password",
          type: "password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }
        const user = await prismadb.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user || !user?.hashedPassword) {
          throw new Error("Invalid email or password");
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isCorrectPassword) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/auth",
  },
  debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn(message) {
      const user: any = message.user;
      // Update user data after successful sign-in
      // Here you can add the logic to update the user's addresses property
      // Example:
      console.log("USER>>>", user);

      const nameParts = user.name.split(" ");

      await prismadb.user.update({
        where: { id: user.id },
        data: {
          // name: user.name,
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(" "),
          hashedPassword: user.hashedPassword ? user.hashedPassword : "123",
          addresses:
            user.addresses.length > 0
              ? user.addresses
              : [
                  {
                    line1: "",
                    line2: "",
                    city: "",
                    country: "",
                    countryCode: "",
                    apartment: "",
                    postal_code: "",
                    state: "",
                    firstName: "",
                    lastName: "",
                    fullName: "",
                    phone: "",
                    street: "",
                    userId: user.id,
                  },
                ],
          phone: "",
          ordersCount: 0,
          emailVerified: user.emailVerified ? user.emailVerified : null,
          image: user.image ? user.image : "",
        },
      });
    },
  },
};

export default NextAuth(authOptions);
