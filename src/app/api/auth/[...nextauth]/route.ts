import { sql } from '@vercel/postgres';
import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { RouteKind } from 'next/dist/server/future/route-kind';
import { authOptions } from './auth-config';


const handler = NextAuth(authOptions);
  
export { handler as GET, handler as POST };