import { NextRequest, NextResponse } from 'next/server'
import { getPool } from '@/lib/db'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('senha') !== process.env.RH_SENHA) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 })
  }
  const db = getPool()
  const result = await db.query(
    'SELECT c.id, c.matricula, col.nome, c.data, c.confirmado_em FROM confirmacoes c JOIN colaboradores col ON col.matricula = c.matricula ORDER BY c.data DESC, col.nome'
  )
  return NextResponse.json({ total: result.rowCount, confirmacoes: result.rows })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  if (searchParams.get('senha') !== process.env.RH_SENHA) {
    return NextResponse.json({ erro: 'Não autorizado.' }, { status: 401 })
  }
  const matricula = searchParams.get('matricula')
  const data = searchParams.get('data')
  if (!matricula || !data) return NextResponse.json({ erro: 'Matrícula e data obrigatórias.' }, { status: 400 })

  const db = getPool()
  const result = await db.query(
    'DELETE FROM confirmacoes WHERE matricula = $1 AND data = $2 RETURNING id',
    [matricula, data]
  )
  return NextResponse.json({ removidas: result.rowCount })
}
