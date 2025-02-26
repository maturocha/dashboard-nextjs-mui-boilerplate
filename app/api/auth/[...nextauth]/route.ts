import NextAuth, { DefaultSession, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

// Declare module augmentation for NextAuth
declare module 'next-auth' {
  interface Session {
    accessToken: string | undefined;
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}


const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'credentials', 
      name: 'Miyi',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'username' },
        password: { label: 'Password', type: 'password', placeholder: 'password' },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Please provide both username and password');
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Authentication failed');
        }

        // Devuelve solo el token
        return { accessToken: data.auth_token };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
    updateAge: 24 * 60 * 60, // 24 horas
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
