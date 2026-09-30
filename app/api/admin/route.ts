import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('senha') !== process.env.RH_SENHA) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 })
  }
  const data = searchParams.get('data')
  if (!data) return NextResponse.json({ erro: 'Data obrigatória.' }, { status: 400 })

  const db = getPool()
  const result = await db.query('DELETE FROM confirmacoes WHERE data = $1 RETURNING id', [data])
  return NextResponse.json({ removidas: result.rowCount })
}
