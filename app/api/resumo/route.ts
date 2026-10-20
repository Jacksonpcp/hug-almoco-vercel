import { NextRequest, NextResponse } from 'next/server'
import { getPool, initSchema } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('senha') !== process.env.RH_SENHA) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 })
  }

  const hoje = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))
    .toISOString()
    .slice(0, 10)

  await initSchema()
  const db = getPool()
  const result = await db.query(
    'SELECT COUNT(*) AS total FROM confirmacoes WHERE data = $1',
    [hoje]
  )

  return NextResponse.json({ data: hoje, total: parseInt(result.rows[0].total) })
}
