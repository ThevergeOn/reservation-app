import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { NextAuthOptions } from 'next-auth'
import Providers from 'next-auth/providers'

const options: NextAuthOptions = {
  providers: [
    Providers.Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  database: process.env.DATABASE_URL,
}

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, options)