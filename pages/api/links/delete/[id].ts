import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '@/lib/db'
import { linksTable } from '@/lib/db/schema'
import { sql, eq, and } from 'drizzle-orm'
import { getToken } from 'next-auth/jwt'

type Response = {
  deletedId?: number
  message?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: Response[] }>,
) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ data: [{ message: 'Method not allowed' }] })
  }
  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const data = await db
    .update(linksTable)
    .set({ deleted_at: sql`NOW()` })
    .where(
      and(
        eq(linksTable.id, Number(req.query.id)),
        eq(linksTable.email, String(session?.email)),
      ),
    )
    .returning({ deletedId: linksTable.id })

  res.status(200).json({ data })
}
