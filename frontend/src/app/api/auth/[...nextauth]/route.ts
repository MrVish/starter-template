import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import crypto from 'crypto';
import { JWT } from 'next-auth/jwt';

// Extend the default session type to include our custom properties
declare module "next-auth" {
  interface Session {
    accessToken?: string;
    token?: string;
    user: {
      id?: string;
      name?: string;
      email?: string;
      image?: string;
      role?: string;
      roles?: string[];
    }
  }
  
  interface User {
    id: string;
    name: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    roles?: string[];
  }
}

// Extend JWT type to include our custom properties
declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    refreshToken?: string;
    sub?: string;
    type?: string;
    jti?: string;
    iat?: number;
    nbf?: number;
    exp?: number;
    role?: string;
    roles?: string[];
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(`${API_URL}/api/v1/auth/login`, {
            email: credentials?.email,
            password: credentials?.password,
          });

          if (response.data && response.data.user) {
            console.log('Login response:', JSON.stringify(response.data));
            return {
              id: response.data.user.id.toString(),
              name: response.data.user.username,
              email: response.data.user.email,
              accessToken: response.data.access_token,
              refreshToken: response.data.refresh_token,
              role: response.data.user.role || 'user',
              roles: response.data.user.roles || [],
            };
          }

          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          throw new Error(error.response?.data?.error || 'Authentication failed');
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      }),
    ] : []),
    ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET ? [
      AzureADProvider({
        clientId: process.env.AZURE_AD_CLIENT_ID,
        clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
        tenantId: process.env.AZURE_AD_TENANT_ID,
      }),
    ] : []),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.role = user.role;
        token.roles = user.roles;
        token.sub = user.id;
        token.type = 'access';
        token.jti = crypto.randomUUID();
        
        const now = Math.floor(Date.now() / 1000);
        token.iat = now;
        token.nbf = now;
        token.exp = now + 3600;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.roles = token.roles;
        session.accessToken = token.accessToken;
        session.token = token.accessToken;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // Always redirect to dashboard after sign in
      if (url.startsWith(baseUrl)) {
        return `${baseUrl}/dashboard`;
      }
      // For other URLs, we'll keep them as is
      return url;
    }
  },
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
});

export { handler as GET, handler as POST };
