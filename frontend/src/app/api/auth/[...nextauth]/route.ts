import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import AzureADProvider from 'next-auth/providers/azure-ad';
import CredentialsProvider from 'next-auth/providers/credentials';
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

// Define a custom type for the token
interface CustomToken extends JWT {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Define the auth options
const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        if (!credentials) {
          throw new Error('Email and password are required');
        }
        
        try {
          console.log('Login attempt with:', credentials.email);
          
          // Using fetch for more control over the request
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              username: credentials.email,
              password: credentials.password
            }),
          });
          
          const data = await response.json();
          console.log('Login response status:', response.status);
          
          if (!response.ok) {
            console.error('Server rejected login:', data);
            throw new Error(data.error || 'Invalid credentials');
          }
          
          if (!data.access_token) {
            console.error('No token in response:', data);
            throw new Error('Authentication failed - no token received');
          }
          
          console.log('Login successful for:', credentials.email);
          
          return {
            id: data.id || '1',
            name: data.name || credentials.email,
            email: data.email || credentials.email,
            username: data.username || credentials.email,
            accessToken: data.access_token,
            refreshToken: data.refresh_token
          };
        } catch (error) {
          console.error('Authentication error:', error);
          throw error;
        }
      }
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
    async jwt({ token, user, account }: { token: CustomToken, user: any, account: any }) {
      // Initial sign in
      if (user && account) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          accessTokenExpires: user.tokenExpiry,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            is_admin: user.is_admin,
            roles: user.roles
          }
        };
      }

      // Return previous token if the access token has not expired yet
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Access token has expired, try to refresh it
      // For this example, we'll just return the existing token
      // In a real app, you'd implement token refresh logic here
      return token;
    },
    async session({ session, token }: { session: any, token: CustomToken }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      // Add user info to session
      if (token.user) {
        session.user = token.user;
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
